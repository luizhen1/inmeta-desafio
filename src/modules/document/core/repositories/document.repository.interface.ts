import { Document } from '../entities/document.entity';

export interface FindAllFilters {
  employeeId?: string;
  documentTypeId?: string;
  status?: string;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IDocumentRepository {
  create(document: Document): Promise<Document>;
  findAll(filters: FindAllFilters): Promise<PaginatedResult<Document>>;
  findById(id: string): Promise<Document | null>;
  findByEmployeeAndType(employeeId: string, documentTypeId: string): Promise<Document | null>;
  update(id: string, data: Partial<Document>): Promise<Document | null>;
  delete(id: string): Promise<void>;
}