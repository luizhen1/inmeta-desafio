import { Employee } from './employee.entity';

export const EMPLOYEE_REPOSITORY = 'EMPLOYEE_REPOSITORY';

export interface IEmployeeRepository {
  create(employee: Employee): Promise<Employee>;
  findAll(): Promise<Employee[]>;
  findById(id: string): Promise<Employee | null>;
  findByCpf(cpf: string): Promise<Employee | null>;
  findByEmail(email: string): Promise<Employee | null>;
  update(id: string, data: Partial<Employee>): Promise<Employee | null>;
  delete(id: string): Promise<void>;
}