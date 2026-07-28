import { ListEmployeesUseCase } from './../usecases/list-employees.usecase';
import { IEmployeeRepository } from '../repositories/employee.repository.interface';
import { Employee } from '../entities/employee.entity';

describe('ListEmployeesUseCase', () => {
  let useCase: ListEmployeesUseCase;
  let repositoryMock: jest.Mocked<IEmployeeRepository>;

  beforeEach(() => {
    repositoryMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCpf: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ListEmployeesUseCase(repositoryMock);
  });

  it('deve retornar uma lista com todos os colaboradores', async () => {
    const employeesMock = [
      new Employee('Ana Souza', '52998224725', 'ana@inmeta.com.br'),
      new Employee('Bruno Lima', '80516315000', 'bruno@inmeta.com.br'),
    ];

    repositoryMock.findAll.mockResolvedValue(employeesMock);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result).toEqual(employeesMock);
    expect(repositoryMock.findAll).toHaveBeenCalledTimes(1);
  });
});