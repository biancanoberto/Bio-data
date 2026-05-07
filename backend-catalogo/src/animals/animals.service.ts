import { extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { SupabaseService } from '../common/supabase/supabase.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { UploadAnimalImageDto } from './dto/upload-animal-image.dto';
import { AnimalsPresenter } from './animals.presenter';

const ANIMAL_IMAGE_BUCKET = 'images-animals';

const animalInclude = {
  category: {
    select: {
      name: true,
    },
  },
  conservationStatus: {
    select: {
      name: true,
    },
  },
  biomes: {
    include: {
      biome: {
        select: {
          name: true,
        },
      },
    },
  },
  images: {
    orderBy: {
      createdAt: 'asc',
    },
  },
} as const;

@Injectable()
export class AnimalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async createAnimal(dto: CreateAnimalDto) {
    const biomeIds = this.uniqueIds(dto.biomeIds);
    await this.validateReferences({
      categoryId: dto.categoryId,
      conservationStatusId: dto.conservationStatusId,
      biomeIds,
    });

    const animal = await this.prisma.animal.create({
      data: {
        commonName: dto.commonName,
        scientificName: dto.scientificName,
        categoryId: dto.categoryId,
        conservationStatusId: dto.conservationStatusId,
        biomes: {
          create: biomeIds.map((biomeId) => ({
            biome: {
              connect: {
                id: biomeId,
              },
            },
          })),
        },
      },
      include: animalInclude,
    });

    return AnimalsPresenter.toDetail(animal, this.resolveImageUrl);
  }

  async listAnimals() {
    const animals = await this.prisma.animal.findMany({
      include: animalInclude,
      orderBy: {
        commonName: 'asc',
      },
    });

    return animals.map((animal) =>
      AnimalsPresenter.toListItem(animal, this.resolveImageUrl),
    );
  }

  async getAnimalById(id: string) {
    const animal = await this.findAnimalOrThrow(id);
    return AnimalsPresenter.toDetail(animal, this.resolveImageUrl);
  }

  async updateAnimal(id: string, dto: UpdateAnimalDto) {
    const biomeIds = dto.biomeIds ? this.uniqueIds(dto.biomeIds) : undefined;

    await this.ensureAnimalExists(id);

    await this.validateReferences({
      categoryId: dto.categoryId,
      conservationStatusId: dto.conservationStatusId,
      biomeIds,
    });

    const animal = await this.prisma.$transaction(async (tx) => {
      await tx.animal.update({
        where: { id },
        data: {
          commonName: dto.commonName,
          scientificName: dto.scientificName,
          categoryId: dto.categoryId,
          conservationStatusId: dto.conservationStatusId,
        },
      });

      if (biomeIds) {
        await tx.animalBiome.deleteMany({
          where: { animalId: id },
        });

        if (biomeIds.length > 0) {
          await tx.animalBiome.createMany({
            data: biomeIds.map((biomeId) => ({
              animalId: id,
              biomeId,
            })),
            skipDuplicates: true,
          });
        }
      }

      const updatedAnimal = await tx.animal.findUnique({
        where: { id },
        include: animalInclude,
      });

      if (!updatedAnimal) {
        throw new NotFoundException(`Animal with id "${id}" was not found.`);
      }

      return updatedAnimal;
    });

    return AnimalsPresenter.toDetail(animal, this.resolveImageUrl);
  }

  async deleteAnimal(id: string) {
    const animal = await this.prisma.animal.findUnique({
      where: { id },
      select: {
        id: true,
        images: {
          select: {
            storageBucket: true,
            storagePath: true,
          },
        },
      },
    });

    if (!animal) {
      throw new NotFoundException(`Animal with id "${id}" was not found.`);
    }

    const imagesByBucket = animal.images.reduce(
      (accumulator: Record<string, string[]>, image: any) => {
        accumulator[image.storageBucket] ??= [];
        accumulator[image.storageBucket].push(image.storagePath);
        return accumulator;
      },
      {} as Record<string, string[]>,
    );

    for (const [bucket, paths] of Object.entries(
      imagesByBucket,
    ) as Array<[string, string[]]>) {
      await this.supabaseService.removeFiles(bucket, paths);
    }

    await this.prisma.animal.delete({
      where: { id },
    });
  }

  async uploadAnimalImage(
    animalId: string,
    dto: UploadAnimalImageDto,
    file: Express.Multer.File,
  ) {
    await this.ensureAnimalExists(animalId);

    const fileExtension = this.resolveFileExtension(file);
    const fileName = `${randomUUID()}${fileExtension}`;
    const storagePath = `animals/${animalId}/${fileName}`;

    await this.supabaseService.uploadImage({
      bucket: ANIMAL_IMAGE_BUCKET,
      path: storagePath,
      file: file.buffer,
      contentType: file.mimetype,
    });

    try {
      const image = await this.prisma.$transaction(async (tx) => {
        if (dto.isCover) {
          await this.clearCoverImages(tx, animalId);
        }

        return tx.animalImage.create({
          data: {
            animalId,
            storageBucket: ANIMAL_IMAGE_BUCKET,
            storagePath,
            altText: dto.altText ?? null,
            isCover: dto.isCover ?? false,
          },
        });
      });

      return AnimalsPresenter.toImage(image, this.resolveImageUrl);
    } catch (error) {
      await this.supabaseService.removeFiles(ANIMAL_IMAGE_BUCKET, [storagePath]);

      if (error instanceof Error) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to persist image metadata.');
    }
  }

  async listAnimalImages(animalId: string) {
    await this.ensureAnimalExists(animalId);

    const images = await this.prisma.animalImage.findMany({
      where: { animalId },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return images.map((image) =>
      AnimalsPresenter.toImage(image, this.resolveImageUrl),
    );
  }

  private async findAnimalOrThrow(id: string) {
    const animal = await this.prisma.animal.findUnique({
      where: { id },
      include: animalInclude,
    });

    if (!animal) {
      throw new NotFoundException(`Animal with id "${id}" was not found.`);
    }

    return animal;
  }

  private async ensureAnimalExists(id: string) {
    const animal = await this.prisma.animal.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!animal) {
      throw new NotFoundException(`Animal with id "${id}" was not found.`);
    }
  }

  private async validateReferences({
    categoryId,
    conservationStatusId,
    biomeIds,
  }: {
    categoryId?: string;
    conservationStatusId?: string;
    biomeIds?: string[];
  }) {
    const [category, conservationStatus, biomeCount] = await Promise.all([
      categoryId
        ? this.prisma.category.findUnique({
            where: { id: categoryId },
            select: { id: true },
          })
        : Promise.resolve(null),
      conservationStatusId
        ? this.prisma.conservationStatus.findUnique({
            where: { id: conservationStatusId },
            select: { id: true },
          })
        : Promise.resolve(null),
      biomeIds
        ? this.prisma.biome.count({
            where: {
              id: {
                in: biomeIds,
              },
            },
          })
        : Promise.resolve<number | null>(null),
    ]);

    if (categoryId && !category) {
      throw new BadRequestException(
        `Category with id "${categoryId}" was not found.`,
      );
    }

    if (conservationStatusId && !conservationStatus) {
      throw new BadRequestException(
        `Conservation status with id "${conservationStatusId}" was not found.`,
      );
    }

    if (biomeIds && biomeCount !== biomeIds.length) {
      throw new BadRequestException('One or more biome ids are invalid.');
    }
  }

  private async clearCoverImages(tx: any, animalId: string) {
    await tx.animalImage.updateMany({
      where: {
        animalId,
        isCover: true,
      },
      data: {
        isCover: false,
      },
    });
  }

  private uniqueIds(ids: string[]) {
    return [...new Set(ids)];
  }

  private resolveFileExtension(file: Express.Multer.File) {
    const originalExtension = extname(file.originalname).toLowerCase();

    if (originalExtension) {
      return originalExtension;
    }

    const mimeExtension = file.mimetype.split('/')[1];

    if (!mimeExtension) {
      throw new BadRequestException('Unable to determine the image extension.');
    }

    return `.${mimeExtension.toLowerCase()}`;
  }

  private readonly resolveImageUrl = (bucket: string, path: string) =>
    this.supabaseService.getPublicUrl(bucket, path);
}
