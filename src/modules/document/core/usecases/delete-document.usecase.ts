import { Injectable, NotFoundException } from '@nestjs/common';
import type { IDocumentRepository } from '../repositories/document.repository.interface';

@Injectable()
export class DeleteDocumentUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    const document = await this.documentRepository.findById(id);

    if (!document) {
      throw new NotFoundException(`Documento com ID ${id} não foi encontrado.`);
    }

    await this.documentRepository.delete(id);
    return { message: 'Documento removido com sucesso.' };
  }
}