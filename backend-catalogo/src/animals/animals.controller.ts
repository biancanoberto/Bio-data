import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { AnimalsService } from './animals.service';
import {
  AnimalDetailResponseDto,
  AnimalImageResponseDto,
  AnimalListItemResponseDto,
} from './dto/animal-response.dto';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { UploadAnimalImageRequestDto } from './dto/upload-animal-image-request.dto';
import { UploadAnimalImageDto } from './dto/upload-animal-image.dto';

@ApiTags('animals')
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um animal',
    description:
      'Cria um novo animal relacionando categoria, status de conservação e biomas já existentes.',
  })
  @ApiCreatedResponse({ type: AnimalDetailResponseDto })
  create(@Body() dto: CreateAnimalDto) {
    return this.animalsService.createAnimal(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar animais',
    description:
      'Retorna os animais já no formato de card para o frontend, incluindo imageUrl pública da capa.',
  })
  @ApiOkResponse({ type: AnimalListItemResponseDto, isArray: true })
  list() {
    return this.animalsService.listAnimals();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar animal por ID',
    description:
      'Retorna o detalhe completo do animal com categoria, status, biomas, imagem de capa e todas as imagens.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: AnimalDetailResponseDto })
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.animalsService.getAnimalById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar animal',
    description:
      'Atualiza os campos enviados. Quando biomeIds é informado, a lista anterior é substituída pela nova.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: AnimalDetailResponseDto })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateAnimalDto,
  ) {
    return this.animalsService.updateAnimal(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover animal',
    description:
      'Remove o animal do banco e tenta remover também os arquivos vinculados no Supabase Storage.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse()
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.animalsService.deleteAnimal(id);
  }

  @Post(':id/images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiOperation({
    summary: 'Enviar imagem para um animal',
    description:
      'Recebe uma imagem via multipart/form-data, envia para o Supabase Storage e salva apenas os metadados no banco.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadAnimalImageRequestDto,
  })
  @ApiCreatedResponse({ type: AnimalImageResponseDto })
  uploadImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UploadAnimalImageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required.');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed.');
    }

    return this.animalsService.uploadAnimalImage(id, dto, file);
  }

  @Get(':id/images')
  @ApiOperation({
    summary: 'Listar imagens de um animal',
    description:
      'Lista as imagens do animal com imageUrl pública pronta para renderização no frontend.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: AnimalImageResponseDto, isArray: true })
  listImages(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.animalsService.listAnimalImages(id);
  }
}
