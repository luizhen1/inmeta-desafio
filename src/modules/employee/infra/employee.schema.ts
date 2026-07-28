import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmployeeDocument = HydratedDocument<EmployeeModel>;

@Schema({ timestamps: true, collection: 'employees' })
export class EmployeeModel {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  cpf!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ type: Date, default: null })
  deletedAt!: Date | null;
}

export const EmployeeSchema = SchemaFactory.createForClass(EmployeeModel);