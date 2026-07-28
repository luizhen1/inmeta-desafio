import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IDocumentTypeRepository } from '../core/repositories/document-type.repository.interface';
import { DocumentType } from '../core/entities/document-type.entity';
import { DocumentTypeModel, DocumentTypeDocument } from './document-type.schema';

@Injectable()
export class DocumentTypeMongoRepository implements IDocumentTypeRepository {
  constructor(
    @InjectModel(DocumentTypeModel.name)
    private readonly model: Model<DocumentTypeDocument>,
  ) {}

  private toDomain(doc: any): DocumentType {
    return new DocumentType(
      doc.name,
      doc.description,
      doc._id.toString(),
      doc.deletedAt,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async create(documentType: DocumentType): Promise<DocumentType> {
    const createdDoc = new this.model({
      name: documentType.name,
      description: documentType.description ?? null,
      deletedAt: documentType.deletedAt ?? null,
    });

    const savedDoc = await createdDoc.save();
    return this.toDomain(savedDoc);
  }

  async findAll(): Promise<DocumentType[]> {
    const docs = await this.model.find({ deletedAt: null }).exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async findById(id: string): Promise<DocumentType | null> {
    const doc = await this.model.findOne({ _id: id, deletedAt: null }).exec();
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async findByName(name: string): Promise<DocumentType | null> {
    const doc = await this.model.findOne({ name, deletedAt: null }).exec();
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async update(id: string, data: Partial<DocumentType>): Promise<DocumentType | null> {
    const updatedDoc = await this.model
      .findOneAndUpdate({ _id: id, deletedAt: null }, { $set: data }, { new: true })
      .exec();

    if (!updatedDoc) return null;
    return this.toDomain(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await this.model
      .findByIdAndUpdate(id, { $set: { deletedAt: new Date() } })
      .exec();
  }
}