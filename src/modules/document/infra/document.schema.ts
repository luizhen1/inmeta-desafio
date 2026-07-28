import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type DocumentDocument = HydratedDocument<DocumentModel>;

@Schema({ _id: false })
export class DocumentVersionModel {
  @Prop({ required: true, type: Number })
  version!: number;

  @Prop({ required: true, type: Boolean, default: true })
  isActive!: boolean;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;

  @Prop({ type: Date, default: Date.now })
  sentAt!: Date;

  @Prop({ required: true, type: String })
  sentBy!: string;
}

const DocumentVersionSchema = SchemaFactory.createForClass(DocumentVersionModel);

@Schema({ timestamps: true, collection: 'documents' })
export class DocumentModel {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeModel', required: true })
  employeeId!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'DocumentTypeModel', required: true })
  documentTypeId!: string;

  @Prop({ required: true, type: String, default: 'PENDING' })
  status!: string;

  @Prop({ required: true, type: Number, default: 1 })
  currentVersion!: number;

  @Prop({ type: [DocumentVersionSchema], default: [] })
  versions!: DocumentVersionModel[];

  @Prop({ type: Date, default: null })
  deletedAt!: Date | null;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentModel);

// 🔒 Índice Único Parcial: Garante que um colaborador não tenha 2 documentos do mesmo tipo ativos
DocumentSchema.index(
  { employeeId: 1, documentTypeId: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);