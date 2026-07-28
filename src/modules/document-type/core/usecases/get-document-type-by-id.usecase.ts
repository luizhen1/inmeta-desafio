import { Injectable, NotFoundException } from '@nestjs/common';
import type { IDocumentTypeRepository } from '../repositories/document-type.repository.interface';
import { DocumentType } from '../entities/document-type.entity';

@Injectable()
export class GetDocumentTypeByIdUseCase {
  constructor(
    private readonly documentTypeRepository: IDocumentTypeRepository,
  ) {}

  async execute(id: string): Promise<DocumentType> {
    const documentType = await this.documentTypeRepository.findById(id);

    if (!documentType) {
      throw new NotFoundException(`Tipo de documento com ID ${id} não foi encontrado.`);
    }

    return documentType;
  }
}