import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IDocumentRepository } from '../core/repositories/document.repository.interface';
import { Document } from '../core/entities/document.entity';
import { DocumentVersion } from '../core/entities/document-version.value-object';
import { DocumentModel, DocumentDocument } from './document.schema';

@Injectable()
export class DocumentMongoRepository implements IDocumentRepository {
  constructor(
    @InjectModel(DocumentModel.name)
    private readonly model: Model<DocumentDocument>,
  ) {}

  private toDomain(doc: any): Document {
    const versions = (doc.versions || []).map(
      (v: any) => new DocumentVersion(v.version, v.isActive, v.sentBy, v.metadata, v.sentAt),
    );

    return new Document(
      doc.employeeId.toString(),
      doc.documentTypeId.toString(),
      doc.status,
      doc.currentVersion,
      versions,
      doc._id.toString(),
      doc.deletedAt,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async create(document: Document): Promise<Document> {
    const createdDoc = new this.model({
      employeeId: document.employeeId,
      documentTypeId: document.documentTypeId,
      status: document.status,
      currentVersion: document.currentVersion,
      versions: document.versions,
      deletedAt: document.deletedAt ?? null,
    });

    const savedDoc = await createdDoc.save();
    return this.toDomain(savedDoc);
  }

  async findAll(): Promise<Document[]> {
    const docs = await this.model.find({ deletedAt: null }).exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async findById(id: string): Promise<Document | null> {
    const doc = await this.model.findOne({ _id: id, deletedAt: null }).exec();
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async findByEmployeeAndType(employeeId: string, documentTypeId: string): Promise<Document | null> {
    const doc = await this.model
      .findOne({ employeeId, documentTypeId, deletedAt: null })
      .exec();
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async update(id: string, data: Partial<Document>): Promise<Document | null> {
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