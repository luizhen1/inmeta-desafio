import { Injectable } from '@nestjs/common';
import type { IDocumentRepository, FindAllFilters, PaginatedResult } from '../repositories/document.repository.interface';
import { Document } from '../entities/document.entity';

@Injectable()
export class ListDocumentsUseCase {
  constructor(private readonly repository: IDocumentRepository) {}

  async execute(filters: FindAllFilters): Promise<PaginatedResult<Document>> {
    const queryFilters: FindAllFilters = {
      ...filters,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    return this.repository.findAll(queryFilters);
  }
}