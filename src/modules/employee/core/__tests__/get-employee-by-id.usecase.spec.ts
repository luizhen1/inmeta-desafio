import { NotFoundException } from '@nestjs/common';
import { GetEmployeeByIdUseCase } from '../usecases/get-employee-by-id.usecase';
import { IEmployeeRepository } from '../repositories/employee.repository.interface';
import { Employee } from '../entities/employee.entity';

describe('GetEmployeeByIdUseCase', () => {
  let useCase: GetEmployeeByIdUseCase;
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

    useCase = new GetEmployeeByIdUseCase(repositoryMock);
  });

  it('deve retornar um colaborador se o ID existir', async () => {
    const employeeMock = new Employee('Ana Souza', '52998224725', 'ana@inmeta.com.br');
    repositoryMock.findById.mockResolvedValue(employeeMock);

    const result = await useCase.execute('valid-id');

    expect(result).toEqual(employeeMock);
    expect(repositoryMock.findById).toHaveBeenCalledWith('valid-id');
  });

  it('deve lançar NotFoundException se o colaborador não for encontrado', async () => {
    repositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id')).rejects.toThrow(
      new NotFoundException('Colaborador com ID invalid-id não foi encontrado.'),
    );
  });
});