import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class UpdateAnimalDto {
  @ApiPropertyOptional({
    type: String,
    example: 'Onça Pintada',
    maxLength: 120,
    description: 'Novo nome popular do animal.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  commonName?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Panthera onca',
    maxLength: 160,
    description: 'Novo nome científico do animal.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  scientificName?: string;

  @ApiPropertyOptional({
    type: String,
    example: '9ff6afcd-df3c-4480-a67d-eeb4f4d3dcb8',
    format: 'uuid',
    description: 'Novo ID de categoria.',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'c3d2ee3c-d15c-4b1b-8e96-e688de95fcc4',
    format: 'uuid',
    description: 'Novo ID de status de conservação.',
  })
  @IsOptional()
  @IsUUID()
  conservationStatusId?: string;

  @ApiPropertyOptional({
    example: ['464d3a46-d8bf-4599-a426-d0ea5d373f3f'],
    type: () => [String],
    description:
      'Nova lista completa de biomas do animal. Quando enviada, substitui os biomas atuais.',
  })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  biomeIds?: string[];
}
