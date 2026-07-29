import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentTypeModel, DocumentTypeSchema } from './infra/document-type.schema';
import { DocumentTypeMongoRepository } from './infra/document-type.mongo.repository';
import { CreateDocumentTypeUseCase } from './core/usecases/create-document-type.usecase';
import { ListDocumentTypesUseCase } from './core/usecases/list-document-types.usecase';
import { GetDocumentTypeByIdUseCase } from './core/usecases/get-document-type-by-id.usecase';
import { UpdateDocumentTypeUseCase } from './core/usecases/update-document-type.usecase';
import { DeleteDocumentTypeUseCase } from './core/usecases/delete-document-type.usecase';
import { DocumentTypeController } from './delivery/document-type.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentTypeModel.name, schema: DocumentTypeSchema },
    ]),
  ],
  controllers: [DocumentTypeController],
  providers: [
    {
      provide: 'IDocumentTypeRepository',
      useClass: DocumentTypeMongoRepository,
    },
    {
      provide: CreateDocumentTypeUseCase,
      useFactory: (repo) => new CreateDocumentTypeUseCase(repo),
      inject: ['IDocumentTypeRepository'],
    },
    {
      provide: ListDocumentTypesUseCase,
      useFactory: (repo) => new ListDocumentTypesUseCase(repo),
      inject: ['IDocumentTypeRepository'],
    },
    {
      provide: GetDocumentTypeByIdUseCase,
      useFactory: (repo) => new GetDocumentTypeByIdUseCase(repo),
      inject: ['IDocumentTypeRepository'],
    },
    {
      provide: UpdateDocumentTypeUseCase,
      useFactory: (repo) => new UpdateDocumentTypeUseCase(repo),
      inject: ['IDocumentTypeRepository'],
    },
    {
      provide: DeleteDocumentTypeUseCase,
      useFactory: (repo) => new DeleteDocumentTypeUseCase(repo),
      inject: ['IDocumentTypeRepository'],
    },
  ],
  exports: ['IDocumentTypeRepository'],
})
export class DocumentTypeModule {}