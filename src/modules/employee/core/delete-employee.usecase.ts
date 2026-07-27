import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EMPLOYEE_REPOSITORY } from './employee.repository.interface';
import type { IEmployeeRepository } from './employee.repository.interface';

@Injectable()
export class DeleteEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    const employee = await this.employeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundException(`Colaborador com ID ${id} não foi encontrado.`);
    }

    await this.employeeRepository.delete(id);

    return { message: 'Colaborador removido com sucesso.' };
  }
}