import { ListDocumentsUseCase } from '../usecases/list-documents.usecase';
import { IDocumentRepository } from '../repositories/document.repository.interface';
import { Document } from '../entities/document.entity';

describe('ListDocumentsUseCase', () => {
  let useCase: ListDocumentsUseCase;
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
    useCase = new ListDocumentsUseCase(repository);
  });

  it('deve listar todos os documentos', async () => {
    const list = [new Document('emp1', 'type1', 'PENDING', 1, [], 'doc1')];
    repository.findAll.mockResolvedValue(list);

    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual(list);
  });
});