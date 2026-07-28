import { NotFoundException } from '@nestjs/common';
import { GetDocumentByIdUseCase } from '../usecases/get-document-by-id.usecase';
import { IDocumentRepository } from '../repositories/document.repository.interface';
import { Document } from '../entities/document.entity';

describe('GetDocumentByIdUseCase', () => {
  let useCase: GetDocumentByIdUseCase;
  let repository: jest.Mocked<IDocumentRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmployeeAndType: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new GetDocumentByIdUseCase(repository);
  });

  it('deve buscar um documento por ID', async () => {
    const doc = new Document('emp1', 'type1', 'PENDING', 1, [], 'doc1');
    repository.findById.mockResolvedValue(doc);

    const result = await useCase.execute('doc1');

    expect(repository.findById).toHaveBeenCalledWith('doc1');
    expect(result).toEqual(doc);
  });

  it('deve lançar NotFoundException se o documento não for encontrado', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid')).rejects.toThrow(NotFoundException);
  });
});