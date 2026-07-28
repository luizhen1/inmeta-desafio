import { ConflictException } from '@nestjs/common';
import { CreateDocumentTypeUseCase } from '../usecases/create-document-type.usecase';
import { IDocumentTypeRepository } from '../repositories/document-type.repository.interface';
import { DocumentType } from '../entities/document-type.entity';

describe('CreateDocumentTypeUseCase', () => {
  let useCase: CreateDocumentTypeUseCase;
  let repository: jest.Mocked<IDocumentTypeRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateDocumentTypeUseCase(repository);
  });

  it('deve criar um tipo de documento com sucesso', async () => {
    const input = { name: 'Comprovante de Residência', description: 'Conta recente' };
    const created = new DocumentType(input.name, input.description, '123');

    repository.findByName.mockResolvedValue(null);
    repository.create.mockResolvedValue(created);

    const result = await useCase.execute(input);

    expect(repository.findByName).toHaveBeenCalledWith(input.name);
    expect(repository.create).toHaveBeenCalled();
    expect(result).toEqual(created);
  });

  it('deve lançar ConflictException ao tentar cadastrar nome duplicado', async () => {
    const input = { name: 'Comprovante de Residência' };
    const existing = new DocumentType(input.name, undefined, '123');

    repository.findByName.mockResolvedValue(existing);

    await expect(useCase.execute(input)).rejects.toThrow(ConflictException);
    expect(repository.create).not.toHaveBeenCalled();
  });
});