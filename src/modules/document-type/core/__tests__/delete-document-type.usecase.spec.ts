import { NotFoundException } from '@nestjs/common';
import { DeleteDocumentTypeUseCase } from '../usecases/delete-document-type.usecase';
import { IDocumentTypeRepository } from '../repositories/document-type.repository.interface';
import { DocumentType } from '../entities/document-type.entity';

describe('DeleteDocumentTypeUseCase', () => {
  let useCase: DeleteDocumentTypeUseCase;
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
    useCase = new DeleteDocumentTypeUseCase(repository);
  });

  it('deve remover um tipo de documento com sucesso', async () => {
    const existing = new DocumentType('Certidão', 'Descrição', '123');
    repository.findById.mockResolvedValue(existing);
    repository.delete.mockResolvedValue();

    const result = await useCase.execute('123');

    expect(repository.findById).toHaveBeenCalledWith('123');
    expect(repository.delete).toHaveBeenCalledWith('123');
    expect(result).toEqual({ message: 'Tipo de documento removido com sucesso.' });
  });

  it('deve lançar NotFoundException se o documento não for encontrado', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id')).rejects.toThrow(NotFoundException);
  });
});