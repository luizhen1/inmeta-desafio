import { ListDocumentsUseCase } from '../usecases/list-documents.usecase';
import { IDocumentRepository, PaginatedResult } from '../repositories/document.repository.interface';
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

  it('deve listar os documentos com paginação e totalizadores', async () => {
    const doc = new Document('emp1', 'type1', 'PENDING', 1, [], 'doc1');
    const paginatedResponse: PaginatedResult<Document> = {
      data: [doc],
      total: 1,
      page: 1,
      limit: 10,
    };

    repository.findAll.mockResolvedValue(paginatedResponse);

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(repository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(result).toEqual(paginatedResponse);
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('deve repassar os filtros opcionais corretamente para o repositório', async () => {
    const paginatedResponse: PaginatedResult<Document> = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    };

    repository.findAll.mockResolvedValue(paginatedResponse);

    await useCase.execute({
      page: 2,
      limit: 5,
      status: 'SENT',
      employeeId: 'emp123',
    });

    expect(repository.findAll).toHaveBeenCalledWith({
      page: 2,
      limit: 5,
      status: 'SENT',
      employeeId: 'emp123',
    });
  });
});