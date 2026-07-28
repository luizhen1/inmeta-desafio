import { NotFoundException } from '@nestjs/common';
import { UpdateDocumentUseCase } from '../usecases/update-document.usecase';
import { IDocumentRepository } from '../repositories/document.repository.interface';
import { Document } from '../entities/document.entity';

describe('UpdateDocumentUseCase', () => {
  let useCase: UpdateDocumentUseCase;
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
    useCase = new UpdateDocumentUseCase(repository);
  });

  it('deve atualizar o status de um documento com sucesso', async () => {
    const existing = new Document('emp1', 'type1', 'PENDING', 1, [], 'doc1');
    const updated = new Document('emp1', 'type1', 'APPROVED', 1, [], 'doc1');

    repository.findById.mockResolvedValue(existing);
    repository.update.mockResolvedValue(updated);

    const result = await useCase.execute('doc1', { status: 'APPROVED' });

    expect(repository.findById).toHaveBeenCalledWith('doc1');
    expect(repository.update).toHaveBeenCalled();
    expect(result).toEqual(updated);
  });

  it('deve criar uma nova versão ao receber novos metadados/enviador', async () => {
    const existing = new Document('emp1', 'type1', 'PENDING', 1, [{ version: 1, isActive: true, sentBy: 'user1', sentAt: new Date() }], 'doc1');

    repository.findById.mockResolvedValue(existing);
    repository.update.mockImplementation(async (id, data) => {
      return new Document('emp1', 'type1', 'PENDING', data.currentVersion!, data.versions!, 'doc1');
    });

    const result = await useCase.execute('doc1', { sentBy: 'user2' });

    expect(result.currentVersion).toBe(2);
    expect(result.versions).toHaveLength(2);
    expect(result.versions[0].isActive).toBe(false);
    expect(result.versions[1].isActive).toBe(true);
  });

  it('deve lançar NotFoundException se o documento não for encontrado', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid', { status: 'APPROVED' })).rejects.toThrow(
      NotFoundException,
    );
  });
});