import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateAnimalDto {
  @ApiProperty({
    type: String,
    example: 'Onça Pintada',
    maxLength: 120,
    description: 'Nome popular do animal exibido para o usuário final.',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  commonName: string;

  @ApiProperty({
    type: String,
    example: 'Panthera onca',
    maxLength: 160,
    description: 'Nome científico do animal.',
  })
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  scientificName: string;

  @ApiProperty({
    type: String,
    example: '9ff6afcd-df3c-4480-a67d-eeb4f4d3dcb8',
    format: 'uuid',
    description: 'ID da categoria já cadastrada no banco.',
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    type: String,
    example: 'c3d2ee3c-d15c-4b1b-8e96-e688de95fcc4',
    format: 'uuid',
    description: 'ID do status de conservação já cadastrado no banco.',
  })
  @IsUUID()
  conservationStatusId: string;

  @ApiProperty({
    example: [
      '464d3a46-d8bf-4599-a426-d0ea5d373f3f',
      '0fe7af43-5d5b-47df-b737-ab1716ef5274',
    ],
    type: () => [String],
    format: 'uuid',
    description:
      'Lista de IDs de biomas relacionados ao animal. Deve conter pelo menos um item.',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  biomeIds: string[];
}
