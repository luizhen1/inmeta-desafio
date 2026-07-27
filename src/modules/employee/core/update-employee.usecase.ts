import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Employee } from './employee.entity';
import { EMPLOYEE_REPOSITORY } from './employee.repository.interface';
import type { IEmployeeRepository } from './employee.repository.interface';

@Injectable()
export class UpdateEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(id: string, data: Partial<Employee>): Promise<Employee> {
    const updatedEmployee = await this.employeeRepository.update(id, data);

    if (!updatedEmployee) {
      throw new NotFoundException(`Colaborador com ID ${id} não foi encontrado para atualização.`);
    }

    return updatedEmployee;
  }
}