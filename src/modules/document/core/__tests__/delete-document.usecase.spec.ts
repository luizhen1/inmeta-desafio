import { NotFoundException } from '@nestjs/common';
import { DeleteDocumentUseCase } from '../usecases/delete-document.usecase';
import { IDocumentRepository } from '../repositories/document.repository.interface';
import { Document } from '../entities/document.entity';

describe('DeleteDocumentUseCase', () => {
  let useCase: DeleteDocumentUseCase;
  let repository: jest.Mocked<IDocumentRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmployeeAndType: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addVersionAtomic: jest.fn(),
    };
    useCase = new DeleteDocumentUseCase(repository);
  });

  it('deve remover um documento com sucesso', async () => {
    const doc = new Document('emp1', 'type1', 'PENDING', 1, [], 'doc1');
    repository.findById.mockResolvedValue(doc);
    repository.delete.mockResolvedValue();

    const result = await useCase.execute('doc1');

    expect(repository.findById).toHaveBeenCalledWith('doc1');
    expect(repository.delete).toHaveBeenCalledWith('doc1');
    expect(result).toEqual({ message: 'Documento removido com sucesso.' });
  });

  it('deve lançar NotFoundException se o documento não for encontrado', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid')).rejects.toThrow(NotFoundException);
  });
});