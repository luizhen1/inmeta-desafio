import { Controller, Post, Get, Put, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDocumentUseCase } from '../core/usecases/create-document.usecase';
import { ListDocumentsUseCase } from '../core/usecases/list-documents.usecase';
import { GetDocumentByIdUseCase } from '../core/usecases/get-document-by-id.usecase';
import { UpdateDocumentUseCase } from '../core/usecases/update-document.usecase';
import { DeleteDocumentUseCase } from '../core/usecases/delete-document.usecase';
import { CreateDocumentDto } from './dtos/create-document.dto';
import { UpdateDocumentDto } from './dtos/update-document.dto';
import { GenerateUploadUrlUseCase } from '../core/usecases/generate-upload-url.usecase';
import { GenerateUploadUrlDto } from './dtos/generate-upload-url.dto';
import { ListDocumentsDto } from './dtos/list-documents.dto';
import { GenerateDownloadUrlUseCase } from '../core/usecases/generate-download-url.usecase';

@ApiTags('Documents')
@Controller('documents')
export class DocumentController {
  constructor(
    private readonly createDocumentUseCase: CreateDocumentUseCase,
    private readonly listDocumentsUseCase: ListDocumentsUseCase,
    private readonly getDocumentByIdUseCase: GetDocumentByIdUseCase,
    private readonly updateDocumentUseCase: UpdateDocumentUseCase,
    private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
    private readonly generateUploadUrlUseCase: GenerateUploadUrlUseCase,
    private readonly generateDownloadUrlUseCase: GenerateDownloadUrlUseCase,
  ) { }

  @Post('upload-url')
  @ApiOperation({
    summary: 'Gera uma URL pré-assinada (Presigned URL) para upload no S3',
    description: `
**Como testar o fluxo de upload completo:**

1. Execute esta rota informando os dados do arquivo (ex: **fileName: "bob.jpg"**).
2. Copie a **url** retornada na resposta.
3. Abra o **Postman** (ou Insomnia) e crie uma requisição **PUT** colando a URL na barra de endereço.
4. ⚠️ **ATENÇÃO:** Vá na aba **Params** e desmarque os parâmetros **x-amz-sdk-checksum-algorithm** e **x-amz-checksum-crc32** (o SDK da AWS injeta isso por padrão, mas mantê-los ativos no Postman sem tratar o hash causará erro).
5. Na aba **Body**, escolha **binary**, selecione o arquivo físico no seu computador e clique em Send (Status 200 esperado).
6. Utilize a **fileKey** gerada aqui no payload da rota de criação (**POST /documents**).
    `
  })
  @ApiResponse({ status: 201, description: 'URL pré-assinada gerada com sucesso.' })
  async generateUploadUrl(@Body() dto: GenerateUploadUrlDto) {
    return this.generateUploadUrlUseCase.execute(dto.fileName, dto.mimeType, dto.fileSizeInBytes);
  }

  @Post()
  @ApiOperation({
    summary: 'Cria um novo documento',
    description: `
Cria o registro do documento no banco de dados.

**Para vincular o arquivo enviado ao S3:**

1. Passe a **fileKey** gerada na rota de upload dentro do objeto **metadata** (ex: **"fileKey": "bob.jpg"**).
2. Copie o **id** gerado na resposta desta requisição para testar a geração da URL de download.
    `
  })
  @ApiResponse({ status: 201, description: 'Documento criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Este colaborador já possui um documento ativo deste tipo.' })
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.createDocumentUseCase.execute(createDocumentDto);
  }

  @Get(':id/download-url')
  @ApiOperation({
    summary: 'Gera uma URL pré-assinada para visualizar/baixar o documento do S3',
    description: `
**Como testar a visualização:**
1. Insira o **id** de um documento existente que possua a propriedade **fileKey** cadastrada no banco.
2. Copie a **downloadUrl** gigante que será retornada na resposta.
3. Cole a URL completa em uma **nova aba do seu navegador**. O arquivo original deve ser exibido ou baixado automaticamente!
    `
  })
  @ApiResponse({ status: 200, description: 'URL de download gerada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado.' })
  async generateDownloadUrl(@Param('id') id: string) {
    return this.generateDownloadUrlUseCase.execute(id);
  }

  @Get()
  @ApiOperation({ summary: 'Lista os documentos com filtros e paginação' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll(@Query() filters: ListDocumentsDto) {
    return this.listDocumentsUseCase.execute({
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      employeeId: filters.employeeId,
      documentTypeId: filters.documentTypeId,
      status: filters.status,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um documento pelo ID' })
  @ApiResponse({ status: 200, description: 'Documento encontrado.' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado.' })
  async findOne(@Param('id') id: string) {
    return this.getDocumentByIdUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados/versão de um documento' })
  @ApiResponse({ status: 200, description: 'Documento atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado.' })
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.updateDocumentUseCase.execute(id, updateDocumentDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza campos específicos/versão de um documento' })
  @ApiResponse({ status: 200, description: 'Documento atualizado parcialmente com sucesso.' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado.' })
  async patchUpdate(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.updateDocumentUseCase.execute(id, updateDocumentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um documento pelo ID' })
  @ApiResponse({ status: 200, description: 'Documento removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado.' })
  async remove(@Param('id') id: string) {
    return this.deleteDocumentUseCase.execute(id);
  }
}