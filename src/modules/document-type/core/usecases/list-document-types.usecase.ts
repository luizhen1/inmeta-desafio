import { Injectable } from '@nestjs/common';
import type { IDocumentTypeRepository } from '../repositories/document-type.repository.interface';
import { DocumentType } from '../entities/document-type.entity';

@Injectable()
export class ListDocumentTypesUseCase {
  constructor(
    private readonly documentTypeRepository: IDocumentTypeRepository,
  ) {}

  async execute(): Promise<DocumentType[]> {
    return this.documentTypeRepository.findAll();
  }
}