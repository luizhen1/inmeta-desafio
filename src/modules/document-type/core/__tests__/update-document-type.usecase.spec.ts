import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateDocumentTypeUseCase } from '../usecases/update-document-type.usecase';
import { IDocumentTypeRepository } from '../repositories/document-type.repository.interface';
import { DocumentType } from '../entities/document-type.entity';

describe('UpdateDocumentTypeUseCase', () => {
  let useCase: UpdateDocumentTypeUseCase;
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
    useCase = new UpdateDocumentTypeUseCase(repository);
  });

  it('deve atualizar um tipo de documento com sucesso', async () => {
    const existing = new DocumentType('RG Old', 'Descrição', '123');
    const updated = new DocumentType('RG Novo', 'Descrição', '123');

    repository.findById.mockResolvedValue(existing);
    repository.findByName.mockResolvedValue(null);
    repository.update.mockResolvedValue(updated);

    const result = await useCase.execute('123', { name: 'RG Novo' });

    expect(repository.findById).toHaveBeenCalledWith('123');
    expect(repository.update).toHaveBeenCalledWith('123', { name: 'RG Novo' });
    expect(result).toEqual(updated);
  });

  it('deve lançar NotFoundException se o documento não for encontrado', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id', { name: 'Novo Nome' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar ConflictException se tentar alterar o nome para um que já existe', async () => {
    const existing = new DocumentType('RG', 'Descrição', '123');
    const anotherWithSameName = new DocumentType('CPF', 'Descrição', '456');

    repository.findById.mockResolvedValue(existing);
    repository.findByName.mockResolvedValue(anotherWithSameName);

    await expect(useCase.execute('123', { name: 'CPF' })).rejects.toThrow(
      ConflictException,
    );
  });
});