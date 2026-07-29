import { ListDocumentTypesUseCase } from '../usecases/list-document-types.usecase';
import { IDocumentTypeRepository } from '../repositories/document-type.repository.interface';
import { DocumentType } from '../entities/document-type.entity';

describe('ListDocumentTypesUseCase', () => {
  let useCase: ListDocumentTypesUseCase;
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
    useCase = new ListDocumentTypesUseCase(repository);
  });

  it('deve retornar uma lista de tipos de documentos', async () => {
    const list = [
      new DocumentType('RG', 'Registro Geral', '1'),
      new DocumentType('CPF', 'Cadastro de Pessoa Física', '2'),
    ];

    repository.findAll.mockResolvedValue(list);

    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual(list);
    expect(result).toHaveLength(2);
  });
});