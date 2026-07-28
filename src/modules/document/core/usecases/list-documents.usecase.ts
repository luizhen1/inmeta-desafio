import { Injectable } from '@nestjs/common';
import type { IDocumentRepository } from '../repositories/document.repository.interface';
import { Document } from '../entities/document.entity';

@Injectable()
export class ListDocumentsUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async execute(): Promise<Document[]> {
    return this.documentRepository.findAll();
  }
}