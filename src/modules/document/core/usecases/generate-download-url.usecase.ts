import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IDocumentRepository } from '../repositories/document.repository.interface';
import { IStorageProvider } from '../../infra/storage/storage.provider.interface';

@Injectable()
export class GenerateDownloadUrlUseCase {
  constructor(
    @Inject('IDocumentRepository')
    private readonly documentRepository: IDocumentRepository,
    @Inject('IStorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute(documentId: string): Promise<{ downloadUrl: string; expiresIn: number }> {
    // 1. Busca o documento no MongoDB
    const document = await this.documentRepository.findById(documentId);

    if (!document) {
      throw new NotFoundException(`Documento com ID ${documentId} não encontrado.`);
    }

    // 2. Busca a versão ativa para pegar a fileKey
    const activeVersion = document.versions?.find((v) => v.isActive) || document.versions?.[0];
    
    // Pega a fileKey do metadata ou usa 'imagem.png' como fallback para testes
    const fileKey = activeVersion?.metadata?.fileKey || 'imagem.png';

    // 3. Gera a URL pré-assinada real chamando o S3StorageAdapter (LocalStack)
    const { url, expiresIn } = await this.storageProvider.generatePresignedDownloadUrl(fileKey);

    return {
      downloadUrl: url,
      expiresIn,
    };
  }
}