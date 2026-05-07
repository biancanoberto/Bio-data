import 'dotenv/config';
import { extname, join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { PrismaPg } from '@prisma/adapter-pg';
import { createClient } from '@supabase/supabase-js';

const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const animalImageBucket = 'images-animals';
const animalSeedImagesDir = join(process.cwd(), 'prisma', 'seed-assets', 'animals');

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

const seededAnimals = [
  {
    commonName: 'Onça-pintada',
    scientificName: 'Panthera onca',
    categoryName: 'Mamífero',
    conservationStatusName: 'Ameaçada',
    biomeNames: ['Pantanal', 'Amazônia'],
    imageBaseName: '1-onca',
  },
  {
    commonName: 'Macaco-prego',
    scientificName: 'Sapajus libidinosus',
    categoryName: 'Mamífero',
    conservationStatusName: 'Pouco Preocupante',
    biomeNames: ['Cerrado', 'Caatinga'],
    imageBaseName: '2-macaco',
  },
  {
    commonName: 'Tartaruga-da-amazônia',
    scientificName: 'Podocnemis expansa',
    categoryName: 'Réptil',
    conservationStatusName: 'Em Perigo',
    biomeNames: ['Amazônia', 'Pantanal'],
    imageBaseName: '3-tartaruga',
  },
  {
    commonName: 'Arara-azul',
    scientificName: 'Anodorhynchus hyacinthinus',
    categoryName: 'Ave',
    conservationStatusName: 'Vulnerável',
    biomeNames: ['Pantanal', 'Cerrado'],
    imageBaseName: '4-arara-azul',
  },
  {
    commonName: 'Coelho-do-mato',
    scientificName: 'Sylvilagus brasiliensis',
    categoryName: 'Mamífero',
    conservationStatusName: 'Pouco Preocupante',
    biomeNames: ['Mata Atlântica', 'Cerrado'],
    imageBaseName: '5-coelho',
  },
];

async function main() {
  const categories = await Promise.all(
    ['Mamífero', 'Ave', 'Réptil', 'Anfíbio'].map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const biomes = await Promise.all(
    [
      'Amazônia',
      'Pantanal',
      'Cerrado',
      'Mata Atlântica',
      'Caatinga',
      'Pampa',
    ].map((name) =>
      prisma.biome.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const conservationStatuses = [
    {
      name: 'Pouco Preocupante',
      level: 1,
      color: 'green',
    },
    {
      name: 'Vulnerável',
      level: 2,
      color: 'yellow',
    },
    {
      name: 'Ameaçada',
      level: 3,
      color: 'orange',
    },
    {
      name: 'Em Perigo',
      level: 4,
      color: 'red',
    },
    {
      name: 'Criticamente em Perigo',
      level: 5,
      color: 'darkred',
    },
  ];

  const statuses = await Promise.all(
    conservationStatuses.map(({ name, level, color }) =>
      prisma.conservationStatus.upsert({
        where: { name },
        update: { level, color },
        create: { name, level, color },
      }),
    ),
  );

  const categoryByName = new Map(categories.map((item: any) => [item.name, item.id]));
  const biomeByName = new Map(biomes.map((item: any) => [item.name, item.id]));
  const statusByName = new Map(statuses.map((item: any) => [item.name, item.id]));

  for (const animal of seededAnimals) {
    const categoryId = categoryByName.get(animal.categoryName);
    const conservationStatusId = statusByName.get(animal.conservationStatusName);
    const biomeIds = animal.biomeNames.map((name) => biomeByName.get(name));

    if (!categoryId || !conservationStatusId || biomeIds.some((id) => !id)) {
      throw new Error(`Missing reference data for seeded animal "${animal.commonName}".`);
    }

    const existingAnimal = await prisma.animal.findFirst({
      where: {
        scientificName: animal.scientificName,
      },
      select: {
        id: true,
      },
    });

    let animalId = existingAnimal?.id;

    if (existingAnimal) {
      await prisma.$transaction(async (tx: any) => {
        await tx.animal.update({
          where: { id: existingAnimal.id },
          data: {
            commonName: animal.commonName,
            scientificName: animal.scientificName,
            categoryId,
            conservationStatusId,
          },
        });

        await tx.animalBiome.deleteMany({
          where: {
            animalId: existingAnimal.id,
          },
        });

        await tx.animalBiome.createMany({
          data: biomeIds.map((biomeId) => ({
            animalId: existingAnimal.id,
            biomeId,
          })),
          skipDuplicates: true,
        });
      });
    } else {
      const createdAnimal = await prisma.animal.create({
        data: {
          commonName: animal.commonName,
          scientificName: animal.scientificName,
          categoryId,
          conservationStatusId,
          biomes: {
            create: biomeIds.map((biomeId) => ({
              biomeId,
            })),
          },
        },
        select: {
          id: true,
        },
      });

      animalId = createdAnimal.id;
    }

    if (!animalId) {
      throw new Error(`Unable to resolve id for seeded animal "${animal.commonName}".`);
    }

    await syncAnimalSeedImage({
      animalId,
      commonName: animal.commonName,
      imageBaseName: animal.imageBaseName,
    });
  }
}

async function syncAnimalSeedImage({
  animalId,
  commonName,
  imageBaseName,
}: {
  animalId: string;
  commonName: string;
  imageBaseName: string;
}) {
  if (!supabase) {
    return;
  }

  const imageFilePath = await findSeedImageFile(imageBaseName);

  if (!imageFilePath) {
    return;
  }

  const fileExtension = extname(imageFilePath).toLowerCase();
  const storagePath = `animals/${animalId}/seed-${imageBaseName}${fileExtension}`;
  const fileBuffer = await readFile(imageFilePath);
  const contentType = resolveContentType(fileExtension);

  const { error: uploadError } = await supabase.storage
    .from(animalImageBucket)
    .upload(storagePath, fileBuffer, {
      upsert: true,
      contentType,
    });

  if (uploadError) {
    throw new Error(
      `Failed to upload seed image for "${commonName}": ${uploadError.message}`,
    );
  }

  const existingImage = await prisma.animalImage.findFirst({
    where: {
      animalId,
      storageBucket: animalImageBucket,
      storagePath,
    },
    select: {
      id: true,
      isCover: true,
    },
  });

  const hasCover = await prisma.animalImage.findFirst({
    where: {
      animalId,
      isCover: true,
    },
    select: {
      id: true,
    },
  });

  const shouldBeCover = existingImage?.isCover ?? !hasCover;

  await prisma.$transaction(async (tx: any) => {
    if (shouldBeCover) {
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

    if (existingImage) {
      await tx.animalImage.update({
        where: {
          id: existingImage.id,
        },
        data: {
          altText: commonName,
          isCover: shouldBeCover,
        },
      });
      return;
    }

    await tx.animalImage.create({
      data: {
        animalId,
        storageBucket: animalImageBucket,
        storagePath,
        altText: commonName,
        isCover: shouldBeCover,
      },
    });
  });
}

async function findSeedImageFile(imageBaseName: string) {
  const extensions = ['.jpg', '.jpeg', '.png', '.webp'];

  for (const extension of extensions) {
    const candidatePath = join(animalSeedImagesDir, `${imageBaseName}${extension}`);

    try {
      await readFile(candidatePath);
      return candidatePath;
    } catch {
      continue;
    }
  }

  return null;
}

function resolveContentType(extension: string) {
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  };

  return contentTypes[extension] ?? 'application/octet-stream';
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
