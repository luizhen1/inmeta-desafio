import { NotFoundException } from '@nestjs/common';
import { UpdateEmployeeUseCase } from '../usecases/update-employee.usecase';
import { IEmployeeRepository } from '../repositories/employee.repository.interface';
import { Employee } from '../entities/employee.entity';

describe('UpdateEmployeeUseCase', () => {
  let useCase: UpdateEmployeeUseCase;
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

    useCase = new UpdateEmployeeUseCase(repositoryMock);
  });

  it('deve atualizar e retornar o colaborador atualizado', async () => {
    const updatedEmployee = new Employee('Ana Souza Alterada', '52998224725', 'ana@inmeta.com.br');
    repositoryMock.update.mockResolvedValue(updatedEmployee);

    const result = await useCase.execute('valid-id', { name: 'Ana Souza Alterada' });

    expect(result).toEqual(updatedEmployee);
    expect(repositoryMock.update).toHaveBeenCalledWith('valid-id', { name: 'Ana Souza Alterada' });
  });

  it('deve lançar NotFoundException se o colaborador a ser atualizado não existir', async () => {
    repositoryMock.update.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id', { name: 'Novo Nome' })).rejects.toThrow(
      NotFoundException,
    );
  });
});