import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadAnimalImageRequestDto {
  @ApiProperty({
    type: String,
    format: 'binary',
    description: 'Arquivo de imagem enviado via multipart/form-data.',
  })
  file: unknown;

  @ApiPropertyOptional({
    type: String,
    example: 'Onça descansando na sombra',
    description: 'Texto alternativo da imagem.',
  })
  altText?: string;

  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description:
      'Se true, a nova imagem passa a ser a capa e as demais deixam de ser capa.',
  })
  isCover?: boolean;
}
