import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DocumentTypeDocument = HydratedDocument<DocumentTypeModel>;

@Schema({ timestamps: true, collection: 'document_types' })
export class DocumentTypeModel {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ type: String, default: null })
  description?: string | null;

  @Prop({ type: Date, default: null })
  deletedAt!: Date | null;
}

export const DocumentTypeSchema = SchemaFactory.createForClass(DocumentTypeModel);