import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateEmployeeUseCase } from './../usecases/create-employee.usecase';
import { IEmployeeRepository } from '../repositories/employee.repository.interface';
import { Employee } from '../entities/employee.entity';

describe('CreateEmployeeUseCase', () => {
  let useCase: CreateEmployeeUseCase;
  let repositoryMock: jest.Mocked<IEmployeeRepository>;

  beforeEach(() => {
    // Mock do repositório
    repositoryMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCpf: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateEmployeeUseCase(repositoryMock);
  });

  it('deve criar um colaborador com sucesso se os dados forem válidos', async () => {
    const input = {
      name: 'Carlos Silva',
      cpf: '52998224725', // CPF matematicamente válido
      email: 'carlos@inmeta.com.br',
    };

    repositoryMock.findByCpf.mockResolvedValue(null);
    repositoryMock.findByEmail.mockResolvedValue(null);
    repositoryMock.create.mockImplementation(async (employee) => employee);

    const result = await useCase.execute(input);

    expect(result).toBeInstanceOf(Employee);
    expect(result.name).toBe(input.name);
    expect(result.cpf).toBe('52998224725');
    expect(repositoryMock.create).toHaveBeenCalledTimes(1);
  });

  it('deve lançar BadRequestException se o CPF for matematicamente inválido', async () => {
    const input = {
      name: 'Teste CPF Invalido',
      cpf: '11122233344',
      email: 'invalido@inmeta.com.br',
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      new BadRequestException('O CPF informado é inválido.'),
    );

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it('deve lançar ConflictException se o CPF já estiver cadastrado', async () => {
    const input = {
      name: 'Carlos Silva',
      cpf: '52998224725',
      email: 'carlos@inmeta.com.br',
    };

    const existingEmployee = new Employee(input.name, input.cpf, input.email);
    repositoryMock.findByCpf.mockResolvedValue(existingEmployee);

    await expect(useCase.execute(input)).rejects.toThrow(
      new ConflictException('Já existe um colaborador cadastrado com este CPF.'),
    );

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });

  it('deve lançar ConflictException se o e-mail já estiver cadastrado', async () => {
    const input = {
      name: 'Carlos Silva',
      cpf: '52998224725',
      email: 'carlos@inmeta.com.br',
    };

    const existingEmployee = new Employee('Outro Nome', '80516315000', input.email);
    repositoryMock.findByCpf.mockResolvedValue(null);
    repositoryMock.findByEmail.mockResolvedValue(existingEmployee);

    await expect(useCase.execute(input)).rejects.toThrow(
      new ConflictException('Já existe um colaborador cadastrado com este e-mail.'),
    );

    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
});