import { NotFoundException } from '@nestjs/common';
import { GetDocumentTypeByIdUseCase } from '../usecases/get-document-type-by-id.usecase';
import { IDocumentTypeRepository } from '../repositories/document-type.repository.interface';
import { DocumentType } from '../entities/document-type.entity';

describe('GetDocumentTypeByIdUseCase', () => {
  let useCase: GetDocumentTypeByIdUseCase;
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
    useCase = new GetDocumentTypeByIdUseCase(repository);
  });

  it('deve retornar um tipo de documento pelo ID', async () => {
    const docType = new DocumentType('Passaporte', 'Documento de viagem', '123');
    repository.findById.mockResolvedValue(docType);

    const result = await useCase.execute('123');

    expect(repository.findById).toHaveBeenCalledWith('123');
    expect(result).toEqual(docType);
  });

  it('deve lançar NotFoundException quando o ID não existir', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id')).rejects.toThrow(NotFoundException);
  });
});