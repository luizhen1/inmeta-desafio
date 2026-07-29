import { NotFoundException, ConflictException } from '@nestjs/common';
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
      addVersionAtomic: jest.fn(), // 👈 1. Adicionado no mock
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

  it('deve criar uma nova versão usando fluxo atômico ao receber novos metadados/enviador', async () => {
    const existing = new Document('emp1', 'type1', 'PENDING', 1, [], 'doc1');
    const updated = new Document('emp1', 'type1', 'SENT', 2, [], 'doc1'); // Simulação de como o banco retornaria

    // 👈 2. A primeira vez que o UseCase chamar findById, retorna o existing. A segunda vez, retorna o updated.
    repository.findById
      .mockResolvedValueOnce(existing)
      .mockResolvedValueOnce(updated); 

    // 👈 3. Simula o sucesso do Optimistic Lock
    repository.addVersionAtomic.mockResolvedValue(true);

    const result = await useCase.execute('doc1', { sentBy: 'user2' });

    expect(repository.addVersionAtomic).toHaveBeenCalled(); // Verifica se chamou a nova função
    expect(result.currentVersion).toBe(2);
  });

  // 👈 4. NOVO TESTE: Garantindo que a regra de concorrência lança o erro correto
  it('deve lançar ConflictException se houver concorrência (Race Condition)', async () => {
    const existing = new Document('emp1', 'type1', 'PENDING', 1, [], 'doc1');
    
    repository.findById.mockResolvedValue(existing);
    
    // Simula a falha atômica (outra requisição chegou antes)
    repository.addVersionAtomic.mockResolvedValue(false);

    await expect(useCase.execute('doc1', { sentBy: 'user2' })).rejects.toThrow(
      ConflictException,
    );

    expect(repository.addVersionAtomic).toHaveBeenCalled();
  });

  it('deve lançar NotFoundException se o documento não for encontrado', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid', { status: 'APPROVED' })).rejects.toThrow(
      NotFoundException,
    );
  });
});