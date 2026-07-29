import { Injectable, NotFoundException } from '@nestjs/common';
import type { IDocumentRepository } from '../repositories/document.repository.interface';
import { Document } from '../entities/document.entity';

@Injectable()
export class GetDocumentByIdUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async execute(id: string): Promise<Document> {
    const document = await this.documentRepository.findById(id);

    if (!document) {
      throw new NotFoundException(`Documento com ID ${id} não foi encontrado.`);
    }

    return document;
  }
}