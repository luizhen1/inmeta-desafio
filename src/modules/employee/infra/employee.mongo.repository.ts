import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IEmployeeRepository } from '../core/repositories/employee.repository.interface';
import { Employee } from '../core/entities/employee.entity';
import { EmployeeModel, EmployeeDocument } from './employee.schema';

@Injectable()
export class EmployeeMongoRepository implements IEmployeeRepository {
  constructor(
    @InjectModel(EmployeeModel.name)
    private readonly employeeModel: Model<EmployeeDocument>,
  ) {}

  private toDomain(doc: any): Employee {
    return new Employee(
      doc.name,
      doc.cpf,
      doc.email,
      doc._id.toString(),
      doc.deletedAt,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async create(employee: Employee): Promise<Employee> {
    const createdEmployee = new this.employeeModel({
      name: employee.name,
      cpf: employee.cpf,
      email: employee.email,
      deletedAt: employee.deletedAt ?? null,
    });

    const savedDoc = await createdEmployee.save();
    return this.toDomain(savedDoc);
  }

  async findAll(): Promise<Employee[]> {
    const docs = await this.employeeModel.find({ deletedAt: null }).exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async findById(id: string): Promise<Employee | null> {
    const doc = await this.employeeModel.findOne({ _id: id, deletedAt: null }).exec();
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async update(id: string, data: Partial<Employee>): Promise<Employee | null> {
    const updatedDoc = await this.employeeModel
      .findOneAndUpdate({ _id: id, deletedAt: null }, { $set: data }, { new: true })
      .exec();

    if (!updatedDoc) return null;
    return this.toDomain(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await this.employeeModel
      .findByIdAndUpdate(id, { $set: { deletedAt: new Date() } })
      .exec();
  }

  async findByCpf(cpf: string): Promise<Employee | null> {
    const doc = await this.employeeModel.findOne({ cpf, deletedAt: null }).exec();
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const doc = await this.employeeModel.findOne({ email, deletedAt: null }).exec();
    if (!doc) return null;
    return this.toDomain(doc);
  }
}