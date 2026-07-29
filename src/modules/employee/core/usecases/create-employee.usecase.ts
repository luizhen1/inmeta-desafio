import {
  Injectable,
  Inject,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Employee } from './../entities/employee.entity';
import { EMPLOYEE_REPOSITORY } from './../repositories/employee.repository.interface';
import type { IEmployeeRepository } from './../repositories/employee.repository.interface';
import { CpfValidator } from './../validators/cpf.validator';

export interface CreateEmployeeInput {
  name: string;
  cpf: string;
  email: string;
  role?: string;
  department?: string;
  requiredDocumentTypes?: string[];
}

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(input: CreateEmployeeInput): Promise<Employee> {
    const cleanCpf = input.cpf.replace(/\D/g, '');

    // 2. Validação Matemática do CPF
    if (!CpfValidator.isValid(cleanCpf)) {
      throw new BadRequestException('O CPF informado é inválido.');
    }

    // 3. Regra de Negócio: Impedir CPF duplicado
    const existingCpf = await this.employeeRepository.findByCpf(cleanCpf);
    if (existingCpf) {
      throw new ConflictException('Já existe um colaborador cadastrado com este CPF.');
    }

    // 4. Regra de Negócio: Impedir E-mail duplicado
    const existingEmail = await this.employeeRepository.findByEmail(input.email);
    if (existingEmail) {
      throw new ConflictException('Já existe um colaborador cadastrado com este e-mail.');
    }

    // 5. Instancia a Entidade passando os novos campos
    const employee = new Employee(
      input.name,
      cleanCpf,
      input.email,
      input.role,
      input.department,
      input.requiredDocumentTypes || [],
    );

    return this.employeeRepository.create(employee);
  }
}