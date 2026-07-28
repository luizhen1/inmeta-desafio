import { Injectable, NotFoundException } from '@nestjs/common';
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

    const updatedData: Partial<Document> = {};

    if (input.status) {
      updatedData.status = input.status;
    }

    // Se houver envio de dados para uma nova versão
    if (input.sentBy || input.metadata) {
      const nextVersionNumber = document.currentVersion + 1;

      // Desativa todas as versões anteriores
      const updatedVersions = document.versions.map((v) => ({
        ...v,
        isActive: false,
      }));

      // Cria a nova versão ativa
      const newVersion = new DocumentVersion(
        nextVersionNumber,
        true,
        input.sentBy || 'system',
        input.metadata,
      );

      updatedVersions.push(newVersion);

      updatedData.currentVersion = nextVersionNumber;
      updatedData.versions = updatedVersions;
    }

    const updated = await this.documentRepository.update(id, updatedData);

    if (!updated) {
      throw new NotFoundException(`Documento com ID ${id} não foi encontrado.`);
    }

    return updated;
  }
}