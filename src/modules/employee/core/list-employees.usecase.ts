import { Injectable, Inject } from '@nestjs/common';
import { Employee } from './employee.entity';
import { EMPLOYEE_REPOSITORY } from './employee.repository.interface';
import type { IEmployeeRepository } from './employee.repository.interface';

@Injectable()
export class ListEmployeesUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(): Promise<Employee[]> {
    return this.employeeRepository.findAll();
  }
}