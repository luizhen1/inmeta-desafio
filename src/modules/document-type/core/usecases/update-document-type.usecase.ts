import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { IDocumentTypeRepository } from '../repositories/document-type.repository.interface';
import { DocumentType } from '../entities/document-type.entity';

export interface UpdateDocumentTypeInput {
  name?: string;
  description?: string;
}

@Injectable()
export class UpdateDocumentTypeUseCase {
  constructor(
    private readonly documentTypeRepository: IDocumentTypeRepository,
  ) {}

  async execute(id: string, input: UpdateDocumentTypeInput): Promise<DocumentType> {
    const documentType = await this.documentTypeRepository.findById(id);

    if (!documentType) {
      throw new NotFoundException(`Tipo de documento com ID ${id} não foi encontrado.`);
    }

    if (input.name && input.name !== documentType.name) {
      const existingType = await this.documentTypeRepository.findByName(input.name);
      if (existingType) {
        throw new ConflictException(`Já existe um tipo de documento cadastrado com o nome "${input.name}".`);
      }
    }

    const updated = await this.documentTypeRepository.update(id, input);
    
    if (!updated) {
      throw new NotFoundException(`Tipo de documento com ID ${id} não foi encontrado.`);
    }

    return updated;
  }
}