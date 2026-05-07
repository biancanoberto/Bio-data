import { ApiProperty } from '@nestjs/swagger';

export class AnimalImageResponseDto {
  @ApiProperty({
    type: String,
    example: '5f4763fd-5f63-4973-9f74-0b1f8d31fd4f',
    description: 'ID único da imagem no banco.',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Onça descansando na sombra',
    nullable: true,
    description: 'Texto alternativo salvo para a imagem.',
  })
  altText: string | null;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Indica se esta imagem é a capa principal do animal.',
  })
  isCover: boolean;

  @ApiProperty({
    type: String,
    example:
      'https://project.supabase.co/storage/v1/object/public/images-animals/animals/uuid/image.jpg',
    description: 'URL pública pronta para uso no frontend.',
  })
  imageUrl: string;

  @ApiProperty({
    type: String,
    example: '2026-05-03T12:00:00.000Z',
    description: 'Data de cadastro da imagem.',
  })
  createdAt: Date;
}

export class AnimalListItemResponseDto {
  @ApiProperty({
    type: String,
    example: '5f4763fd-5f63-4973-9f74-0b1f8d31fd4f',
    description: 'ID do animal.',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Onça Pintada',
    description: 'Nome popular do animal.',
  })
  commonName: string;

  @ApiProperty({
    type: String,
    example: 'Panthera onca',
    description: 'Nome científico do animal.',
  })
  scientificName: string;

  @ApiProperty({
    type: String,
    example: 'Mamífero',
    description: 'Nome da categoria do animal.',
  })
  category: string;

  @ApiProperty({
    type: String,
    example: 'Ameaçada',
    description: 'Nome do status de conservação.',
  })
  conservationStatus: string;

  @ApiProperty({
    type: [String],
    example: ['Pantanal', 'Amazônia'],
    description: 'Lista de nomes dos biomas associados ao animal.',
  })
  biomes: string[];

  @ApiProperty({
    type: String,
    example:
      'https://project.supabase.co/storage/v1/object/public/images-animals/animals/uuid/image.jpg',
    nullable: true,
    description:
      'URL pública da imagem de capa. Pode ser null quando o animal ainda não possui imagem.',
  })
  imageUrl: string | null;
}

export class AnimalDetailResponseDto extends AnimalListItemResponseDto {
  @ApiProperty({
    type: () => AnimalImageResponseDto,
    nullable: true,
    description: 'Objeto da imagem de capa do animal.',
  })
  coverImage: AnimalImageResponseDto | null;

  @ApiProperty({
    type: () => [AnimalImageResponseDto],
    description: 'Lista completa de imagens cadastradas para o animal.',
  })
  images: AnimalImageResponseDto[];

  @ApiProperty({
    type: String,
    example: '2026-05-03T12:00:00.000Z',
    description: 'Data de criação do animal.',
  })
  createdAt: Date;

  @ApiProperty({
    type: String,
    example: '2026-05-03T12:15:00.000Z',
    description: 'Data da última atualização do animal.',
  })
  updatedAt: Date;
}
