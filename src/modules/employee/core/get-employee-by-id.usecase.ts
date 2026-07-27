import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Employee } from './employee.entity';
import { EMPLOYEE_REPOSITORY } from './employee.repository.interface';
import type { IEmployeeRepository } from './employee.repository.interface';

@Injectable()
export class GetEmployeeByIdUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findById(id);
    
    if (!employee) {
      throw new NotFoundException(`Colaborador com ID ${id} não foi encontrado.`);
    }

    return employee;
  }
}