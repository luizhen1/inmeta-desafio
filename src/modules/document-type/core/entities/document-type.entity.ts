export class DocumentType {
  id?: string;
  name: string;
  description?: string;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    name: string,
    description?: string,
    id?: string,
    deletedAt?: Date | null,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.name = name;
    this.description = description;
    this.id = id;
    this.deletedAt = deletedAt ?? null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  delete(): void {
    this.deletedAt = new Date();
  }
}