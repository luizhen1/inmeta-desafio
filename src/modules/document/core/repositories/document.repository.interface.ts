import { Document } from '../entities/document.entity';

export interface IDocumentRepository {
  create(document: Document): Promise<Document>;
  findAll(): Promise<Document[]>;
  findById(id: string): Promise<Document | null>;
  findByEmployeeAndType(employeeId: string, documentTypeId: string): Promise<Document | null>;
  update(id: string, data: Partial<Document>): Promise<Document | null>;
  delete(id: string): Promise<void>;
}