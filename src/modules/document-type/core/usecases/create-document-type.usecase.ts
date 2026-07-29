import { ConflictException, Injectable } from '@nestjs/common';
import type { IDocumentTypeRepository } from '../repositories/document-type.repository.interface';
import { DocumentType } from '../entities/document-type.entity';

export interface CreateDocumentTypeInput {
  name: string;
  description?: string;
}

@Injectable()
export class CreateDocumentTypeUseCase {
  constructor(
    private readonly documentTypeRepository: IDocumentTypeRepository,
  ) {}

  async execute(input: CreateDocumentTypeInput): Promise<DocumentType> {
    const existingType = await this.documentTypeRepository.findByName(input.name);

    if (existingType) {
      throw new ConflictException(`Já existe um tipo de documento cadastrado com o nome "${input.name}".`);
    }

    const documentType = new DocumentType(input.name, input.description);
    return this.documentTypeRepository.create(documentType);
  }
}