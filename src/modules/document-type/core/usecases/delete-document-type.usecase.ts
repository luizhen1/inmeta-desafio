import { Injectable, NotFoundException } from '@nestjs/common';
import type { IDocumentTypeRepository } from '../repositories/document-type.repository.interface';

@Injectable()
export class DeleteDocumentTypeUseCase {
  constructor(
    private readonly documentTypeRepository: IDocumentTypeRepository,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    const documentType = await this.documentTypeRepository.findById(id);

    if (!documentType) {
      throw new NotFoundException(`Tipo de documento com ID ${id} não foi encontrado.`);
    }

    await this.documentTypeRepository.delete(id);
    return { message: 'Tipo de documento removido com sucesso.' };
  }
}