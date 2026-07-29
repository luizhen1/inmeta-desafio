import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import type { IDocumentRepository } from '../repositories/document.repository.interface';
import { Document } from '../entities/document.entity';
import { DocumentVersion } from '../entities/document-version.value-object';

export interface UpdateDocumentInput {
  status?: string;
  sentBy?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class UpdateDocumentUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async execute(id: string, input: UpdateDocumentInput): Promise<Document> {

    const document = await this.documentRepository.findById(id);

    if (!document) {
      throw new NotFoundException(`Documento com ID ${id} não foi encontrado.`);
    }

    if (input.sentBy || input.metadata) {
      const expectedVersion = document.currentVersion;
      const nextVersionNumber = expectedVersion + 1;

      const newVersion = new DocumentVersion(
        nextVersionNumber,
        true,
        input.sentBy || 'system',
        input.metadata,
      );

      const newStatus = input.status || document.status;

      const isSuccess = await this.documentRepository.addVersionAtomic(
        id,
        expectedVersion,
        newVersion,
        newStatus
      );

      if (!isSuccess) {
        throw new ConflictException(
          'Concorrência detectada: Outra versão deste documento foi enviada simultaneamente. Por favor, recarregue a página e tente novamente.'
        );
      }

      const updatedDocument = await this.documentRepository.findById(id);
      return updatedDocument!;
    }

    const updatedData: Partial<Document> = {};

    if (input.status) {
      updatedData.status = input.status;
    }

    const updated = await this.documentRepository.update(id, updatedData);

    if (!updated) {
      throw new NotFoundException(`Documento com ID ${id} não foi encontrado na etapa de atualização.`);
    }

    return updated;
  }
}