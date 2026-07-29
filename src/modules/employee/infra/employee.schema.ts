import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'employees' })
export class EmployeeModel extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  cpf!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: false })
  role?: string;

  @Prop({ required: false })
  department?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'DocumentTypeModel' }], default: [] })
  requiredDocumentTypes!: string[];

  @Prop({ required: false, default: null })
  deletedAt?: Date | null;
}

export const EmployeeSchema = SchemaFactory.createForClass(EmployeeModel);

export type EmployeeDocument = EmployeeModel & Document;