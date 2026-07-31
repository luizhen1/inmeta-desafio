import { GenerateDownloadUrlUseCase } from '../usecases/generate-download-url.usecase';
import { IDocumentRepository } from '../repositories/document.repository.interface';
import { IStorageProvider } from '../../infra/storage/storage.provider.interface';
import { NotFoundException } from '@nestjs/common';

describe('GenerateDownloadUrlUseCase', () => {
  let useCase: GenerateDownloadUrlUseCase;
  let mockRepository: jest.Mocked<IDocumentRepository>;
  let mockStorageProvider: jest.Mocked<IStorageProvider>;

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

    mockStorageProvider = {
      generatePresignedUploadUrl: jest.fn(),
      generatePresignedDownloadUrl: jest.fn(),
    };

    useCase = new GenerateDownloadUrlUseCase(mockRepository, mockStorageProvider);
  });

  it('deve gerar uma URL de download pré-assinada se o documento existir', async () => {
    const fakeDocumentId = 'valid-mongo-id';
    const fakePresignedResponse = {
      url: 'https://inmeta-fake-s3-bucket.s3.amazonaws.com/valid-mongo-id',
      expiresIn: 3600,
    };

    mockRepository.findById.mockResolvedValue({
      id: fakeDocumentId,
      fileKey: 'imagem.png',
      currentVersion: { fileKey: 'imagem.png' },
    } as any);

    mockStorageProvider.generatePresignedDownloadUrl.mockResolvedValue(fakePresignedResponse);

    const result = await useCase.execute(fakeDocumentId);

    expect(mockRepository.findById).toHaveBeenCalledWith(fakeDocumentId);
    expect(mockStorageProvider.generatePresignedDownloadUrl).toHaveBeenCalledWith('imagem.png');
    expect(result).toEqual({
      downloadUrl: fakePresignedResponse.url,
      expiresIn: fakePresignedResponse.expiresIn,
    });
  });

  it('deve lançar NotFoundException se o documento não for encontrado no banco', async () => {
    const fakeDocumentId = 'invalid-id';
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(fakeDocumentId)).rejects.toThrow(NotFoundException);
    expect(mockRepository.findById).toHaveBeenCalledWith(fakeDocumentId);
  });
});