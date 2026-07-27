import { Injectable, Inject } from '@nestjs/common';
import { Employee } from './employee.entity';
import { EMPLOYEE_REPOSITORY } from './employee.repository.interface';
import type { IEmployeeRepository } from './employee.repository.interface';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(data: { name: string; cpf: string; email: string }): Promise<Employee> {
    const employee = new Employee(data.name, data.cpf, data.email);
    return this.employeeRepository.create(employee);
  }
}