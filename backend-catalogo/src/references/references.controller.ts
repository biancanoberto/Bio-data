import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { ReferencesService } from './references.service';

class ReferenceItemDto {
  @ApiProperty({
    type: String,
    example: '9ff6afcd-df3c-4480-a67d-eeb4f4d3dcb8',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Mamífero',
  })
  name: string;
}

class ConservationStatusReferenceDto extends ReferenceItemDto {
  @ApiProperty({
    type: Number,
    example: 3,
  })
  level: number;

  @ApiProperty({
    type: String,
    example: 'orange',
    nullable: true,
  })
  color: string | null;
}

@ApiTags('references')
@Controller()
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Get('categories')
  @ApiOperation({
    summary: 'Listar categorias',
    description: 'Retorna as categorias disponíveis para cadastro de animais.',
  })
  @ApiOkResponse({ type: ReferenceItemDto, isArray: true })
  listCategories() {
    return this.referencesService.listCategories();
  }

  @Get('biomes')
  @ApiOperation({
    summary: 'Listar biomas',
    description: 'Retorna os biomas disponíveis para vincular aos animais.',
  })
  @ApiOkResponse({ type: ReferenceItemDto, isArray: true })
  listBiomes() {
    return this.referencesService.listBiomes();
  }

  @Get('conservation-statuses')
  @ApiOperation({
    summary: 'Listar status de conservação',
    description:
      'Retorna os status de conservação disponíveis para cadastro de animais.',
  })
  @ApiOkResponse({ type: ConservationStatusReferenceDto, isArray: true })
  listConservationStatuses() {
    return this.referencesService.listConservationStatuses();
  }
}
