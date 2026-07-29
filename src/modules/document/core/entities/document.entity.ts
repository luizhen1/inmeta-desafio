import { DocumentVersion } from './document-version.value-object';

export class Document {
  id?: string;
  employeeId: string;
  documentTypeId: string;
  status: string;
  currentVersion: number;
  versions: DocumentVersion[];
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    employeeId: string,
    documentTypeId: string,
    status: string,
    currentVersion: number,
    versions: DocumentVersion[],
    id?: string,
    deletedAt?: Date | null,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.employeeId = employeeId;
    this.documentTypeId = documentTypeId;
    this.status = status;
    this.currentVersion = currentVersion;
    this.versions = versions;
    this.id = id;
    this.deletedAt = deletedAt ?? null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}