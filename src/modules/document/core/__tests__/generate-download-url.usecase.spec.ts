import { GenerateDownloadUrlUseCase } from '../usecases/generate-download-url.usecase';
import { IDocumentRepository } from '../repositories/document.repository.interface';
import { NotFoundException } from '@nestjs/common';

describe('GenerateDownloadUrlUseCase', () => {
  let useCase: GenerateDownloadUrlUseCase;
  let mockRepository: jest.Mocked<IDocumentRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByEmployeeAndType: jest.fn(),
      addVersionAtomic: jest.fn(),
    };

    useCase = new GenerateDownloadUrlUseCase(mockRepository);
  });

  it('deve gerar uma URL de download pré-assinada se o documento existir', async () => {
    const fakeDocumentId = 'valid-mongo-id';
    mockRepository.findById.mockResolvedValue({ id: fakeDocumentId } as any);

    const result = await useCase.execute(fakeDocumentId);

    expect(mockRepository.findById).toHaveBeenCalledWith(fakeDocumentId);
    expect(result).toHaveProperty('downloadUrl');
    expect(result.downloadUrl).toContain('inmeta-fake-s3-bucket');
    expect(result.downloadUrl).toContain(fakeDocumentId);
    expect(result.expiresIn).toBe(3600);
  });

  it('deve lançar NotFoundException se o documento não for encontrado no banco', async () => {
    const fakeDocumentId = 'invalid-id';
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(fakeDocumentId)).rejects.toThrow(NotFoundException);
    expect(mockRepository.findById).toHaveBeenCalledWith(fakeDocumentId);
  });
});