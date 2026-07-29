import { DocumentType } from '../entities/document-type.entity';

export interface IDocumentTypeRepository {
  create(documentType: DocumentType): Promise<DocumentType>;
  findAll(): Promise<DocumentType[]>;
  findById(id: string): Promise<DocumentType | null>;
  findByName(name: string): Promise<DocumentType | null>;
  update(id: string, data: Partial<DocumentType>): Promise<DocumentType | null>;
  delete(id: string): Promise<void>;
}