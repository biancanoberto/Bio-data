import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ReferencesService {
  constructor(private readonly prisma: PrismaService) {}

  listCategories() {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  listBiomes() {
    return this.prisma.biome.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  listConservationStatuses() {
    return this.prisma.conservationStatus.findMany({
      select: {
        id: true,
        name: true,
        level: true,
        color: true,
      },
      orderBy: {
        level: 'asc',
      },
    });
  }
}
