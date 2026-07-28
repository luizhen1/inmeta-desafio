import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentModel, DocumentSchema } from './infra/document.schema';
import { DocumentMongoRepository } from './infra/document.mongo.repository';
import { CreateDocumentUseCase } from './core/usecases/create-document.usecase';
import { ListDocumentsUseCase } from './core/usecases/list-documents.usecase';
import { GetDocumentByIdUseCase } from './core/usecases/get-document-by-id.usecase';
import { UpdateDocumentUseCase } from './core/usecases/update-document.usecase';
import { DeleteDocumentUseCase } from './core/usecases/delete-document.usecase';
import { GenerateUploadUrlUseCase } from './core/usecases/generate-upload-url.usecase'; // 👈 Importe o UseCase
import { MockStorageProvider } from './infra/storage/mock-storage.provider'; // 👈 Importe o Storage Provider
import { DocumentController } from './delivery/document.controller';
import { EmployeeModule } from '../employee/employee.module';
import { DocumentTypeModule } from '../document-type/document-type.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentModel.name, schema: DocumentSchema },
    ]),
    EmployeeModule,
    DocumentTypeModule,
  ],
  controllers: [DocumentController],
  providers: [
    {
      provide: 'IDocumentRepository',
      useClass: DocumentMongoRepository,
    },
    {
      provide: 'IStorageProvider',
      useClass: MockStorageProvider,
    },
    {
      provide: GenerateUploadUrlUseCase,
      useFactory: (storage) => new GenerateUploadUrlUseCase(storage),
      inject: ['IStorageProvider'],
    },
    {
      provide: CreateDocumentUseCase,
      useFactory: (docRepo, empRepo, docTypeRepo) =>
        new CreateDocumentUseCase(docRepo, empRepo, docTypeRepo),
      inject: ['IDocumentRepository', 'IEmployeeRepository', 'IDocumentTypeRepository'],
    },
    {
      provide: ListDocumentsUseCase,
      useFactory: (repo) => new ListDocumentsUseCase(repo),
      inject: ['IDocumentRepository'],
    },
    {
      provide: GetDocumentByIdUseCase,
      useFactory: (repo) => new GetDocumentByIdUseCase(repo),
      inject: ['IDocumentRepository'],
    },
    {
      provide: UpdateDocumentUseCase,
      useFactory: (repo) => new UpdateDocumentUseCase(repo),
      inject: ['IDocumentRepository'],
    },
    {
      provide: DeleteDocumentUseCase,
      useFactory: (repo) => new DeleteDocumentUseCase(repo),
      inject: ['IDocumentRepository'],
    },
  ],
  exports: ['IDocumentRepository'],
})
export class DocumentModule {}