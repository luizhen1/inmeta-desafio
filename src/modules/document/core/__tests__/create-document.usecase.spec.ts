import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateDocumentUseCase } from '../usecases/create-document.usecase';
import { IDocumentRepository } from '../repositories/document.repository.interface';
import { IEmployeeRepository } from '../../../employee/core/repositories/employee.repository.interface';
import { IDocumentTypeRepository } from '../../../document-type/core/repositories/document-type.repository.interface';
import { Document } from '../entities/document.entity';
import { DocumentType } from '../../../document-type/core/entities/document-type.entity';

describe('CreateDocumentUseCase', () => {
  let useCase: CreateDocumentUseCase;
  let docRepo: jest.Mocked<IDocumentRepository>;
  let empRepo: jest.Mocked<IEmployeeRepository>;
  let docTypeRepo: jest.Mocked<IDocumentTypeRepository>;

  const mockEmployee = {
    id: 'emp123',
    name: 'João da Silva',
    cpf: '12345678901',
    email: 'joao@test.com',
    requiredDocumentTypes: [],
  } as any;

  beforeEach(() => {
    docRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmployeeAndType: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addVersionAtomic: jest.fn(),
    };
    empRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCpf: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    docTypeRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateDocumentUseCase(docRepo, empRepo, docTypeRepo);
  });

  it('deve criar um documento com sucesso', async () => {
    const input = {
      employeeId: 'emp123',
      documentTypeId: 'type123',
      sentBy: 'user@test.com',
    };

    empRepo.findById.mockResolvedValue(mockEmployee);
    docTypeRepo.findById.mockResolvedValue(
      new DocumentType('RG', 'Registro Geral', 'type123'),
    );
    docRepo.findByEmployeeAndType.mockResolvedValue(null);

    const createdDoc = new Document(
      input.employeeId,
      input.documentTypeId,
      'PENDING',
      1,
      [],
      'doc123',
    );
    docRepo.create.mockResolvedValue(createdDoc);

    const result = await useCase.execute(input);

    expect(empRepo.findById).toHaveBeenCalledWith('emp123');
    expect(docTypeRepo.findById).toHaveBeenCalledWith('type123');
    expect(docRepo.create).toHaveBeenCalled();
    expect(result).toEqual(createdDoc);
  });

  it('deve lançar NotFoundException se o colaborador não existir', async () => {
    empRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        employeeId: 'invalid',
        documentTypeId: 'type123',
        sentBy: 'user',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve lançar NotFoundException se o tipo de documento não existir', async () => {
    empRepo.findById.mockResolvedValue(mockEmployee);
    docTypeRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        employeeId: 'emp123',
        documentTypeId: 'invalid',
        sentBy: 'user',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ConflictException se o documento já estiver cadastrado para o colaborador', async () => {
    empRepo.findById.mockResolvedValue(mockEmployee);
    docTypeRepo.findById.mockResolvedValue(
      new DocumentType('RG', 'Registro', 'type123'),
    );
    docRepo.findByEmployeeAndType.mockResolvedValue(
      new Document('emp123', 'type123', 'APPROVED', 1, [], 'doc123'),
    );

    await expect(
      useCase.execute({
        employeeId: 'emp123',
        documentTypeId: 'type123',
        sentBy: 'user',
      }),
    ).rejects.toThrow(ConflictException);
  });
});