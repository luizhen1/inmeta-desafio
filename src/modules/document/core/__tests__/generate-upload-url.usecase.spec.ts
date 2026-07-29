import { GenerateUploadUrlUseCase } from '../usecases/generate-upload-url.usecase';
import { IStorageProvider } from '../../infra/storage/storage.provider.interface';

describe('GenerateUploadUrlUseCase', () => {
  let useCase: GenerateUploadUrlUseCase;
  let storageProvider: jest.Mocked<IStorageProvider>;

  beforeEach(() => {
    storageProvider = {
      generatePresignedUploadUrl: jest.fn(),
    };
    useCase = new GenerateUploadUrlUseCase(storageProvider);
  });

  it('deve gerar uma presigned url com sucesso', async () => {
    const mockResponse = {
      uploadUrl: 'https://s3.amazonaws.com/bucket/doc.pdf',
      fileKey: 'documents/doc.pdf',
      expiresInSeconds: 900,
    };

    storageProvider.generatePresignedUploadUrl.mockResolvedValue(mockResponse);

    const result = await useCase.execute('doc.pdf', 'application/pdf', 1024);

    expect(storageProvider.generatePresignedUploadUrl).toHaveBeenCalledWith(
      'doc.pdf',
      'application/pdf',
      1024,
    );
    expect(result).toEqual(mockResponse);
  });
});