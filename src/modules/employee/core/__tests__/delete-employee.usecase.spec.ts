import { NotFoundException } from '@nestjs/common';
import { DeleteEmployeeUseCase } from '../usecases/delete-employee.usecase';
import { IEmployeeRepository } from '../repositories/employee.repository.interface';
import { Employee } from '../entities/employee.entity';

describe('DeleteEmployeeUseCase', () => {
  let useCase: DeleteEmployeeUseCase;
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

    useCase = new DeleteEmployeeUseCase(repositoryMock);
  });

  it('deve remover o colaborador com sucesso e retornar mensagem de confirmação', async () => {
    const employeeMock = new Employee('Ana Souza', '52998224725', 'ana@inmeta.com.br');
    repositoryMock.findById.mockResolvedValue(employeeMock);
    repositoryMock.delete.mockResolvedValue();

    const result = await useCase.execute('valid-id');

    expect(result).toEqual({ message: 'Colaborador removido com sucesso.' });
    expect(repositoryMock.delete).toHaveBeenCalledWith('valid-id');
  });

  it('deve lançar NotFoundException ao tentar deletar colaborador inexistente', async () => {
    repositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id')).rejects.toThrow(
      new NotFoundException('Colaborador com ID invalid-id não foi encontrado.'),
    );

    expect(repositoryMock.delete).not.toHaveBeenCalled();
  });
});