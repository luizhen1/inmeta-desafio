import { Controller, Post, Get, Put, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDocumentTypeUseCase } from '../core/usecases/create-document-type.usecase';
import { ListDocumentTypesUseCase } from '../core/usecases/list-document-types.usecase';
import { GetDocumentTypeByIdUseCase } from '../core/usecases/get-document-type-by-id.usecase';
import { UpdateDocumentTypeUseCase } from '../core/usecases/update-document-type.usecase';
import { DeleteDocumentTypeUseCase } from '../core/usecases/delete-document-type.usecase';
import { CreateDocumentTypeDto } from './dtos/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dtos/update-document-type.dto';

@ApiTags('DocumentType')
@Controller('document-types')
export class DocumentTypeController {
  constructor(
    private readonly createDocumentTypeUseCase: CreateDocumentTypeUseCase,
    private readonly listDocumentTypesUseCase: ListDocumentTypesUseCase,
    private readonly getDocumentTypeByIdUseCase: GetDocumentTypeByIdUseCase,
    private readonly updateDocumentTypeUseCase: UpdateDocumentTypeUseCase,
    private readonly deleteDocumentTypeUseCase: DeleteDocumentTypeUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo tipo de documento' })
  @ApiResponse({ status: 201, description: 'Tipo de documento criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Tipo de documento já cadastrado.' })
  async create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
    return this.createDocumentTypeUseCase.execute(createDocumentTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os tipos de documentos' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll() {
    return this.listDocumentTypesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um tipo de documento pelo ID' })
  @ApiResponse({ status: 200, description: 'Tipo de documento encontrado.' })
  @ApiResponse({ status: 404, description: 'Tipo de documento não encontrado.' })
  async findOne(@Param('id') id: string) {
    return this.getDocumentTypeByIdUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um tipo de documento' })
  @ApiResponse({ status: 200, description: 'Tipo de documento atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Tipo de documento não encontrado.' })
  async update(@Param('id') id: string, @Body() updateDocumentTypeDto: UpdateDocumentTypeDto) {
    return this.updateDocumentTypeUseCase.execute(id, updateDocumentTypeDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza campos específicos de um tipo de documento' })
  @ApiResponse({ status: 200, description: 'Tipo de documento atualizado parcialmente com sucesso.' })
  @ApiResponse({ status: 404, description: 'Tipo de documento não encontrado.' })
  async patchUpdate(@Param('id') id: string, @Body() updateDocumentTypeDto: UpdateDocumentTypeDto) {
    return this.updateDocumentTypeUseCase.execute(id, updateDocumentTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um tipo de documento pelo ID' })
  @ApiResponse({ status: 200, description: 'Tipo de documento removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Tipo de documento não encontrado.' })
  async remove(@Param('id') id: string) {
    return this.deleteDocumentTypeUseCase.execute(id);
  }
}