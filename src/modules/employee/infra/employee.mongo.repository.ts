import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IEmployeeRepository } from '../core/employee.repository.interface';
import { Employee } from '../core/employee.entity';
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
      doc.isActive,
      doc._id.toString(),
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async create(employee: Employee): Promise<Employee> {
    const createdEmployee = new this.employeeModel({
      name: employee.name,
      cpf: employee.cpf,
      email: employee.email,
      isActive: employee.isActive,
    });
    
    const savedDoc = await createdEmployee.save();
    return this.toDomain(savedDoc);
  }

  async findAll(): Promise<Employee[]> { return []; }
  async findById(id: string): Promise<Employee | null> { return null; }
  async update(id: string, data: Partial<Employee>): Promise<Employee | null> { return null; }
  async delete(id: string): Promise<void> {}
}