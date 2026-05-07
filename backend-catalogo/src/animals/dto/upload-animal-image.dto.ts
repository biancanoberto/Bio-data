import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const toBoolean = ({ value }: { value: unknown }) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true;
    }

    if (value.toLowerCase() === 'false') {
      return false;
    }
  }

  return value;
};

export class UploadAnimalImageDto {
  @ApiPropertyOptional({
    type: String,
    example: 'Onça descansando na sombra',
    maxLength: 255,
    description: 'Texto alternativo da imagem para acessibilidade e contexto.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(255)
  altText?: string;

  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description:
      'Define se a imagem enviada deve virar a imagem de capa do animal.',
  })
  @Transform(toBoolean)
  @IsOptional()
  @IsBoolean()
  isCover?: boolean;
}
