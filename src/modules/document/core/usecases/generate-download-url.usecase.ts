import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IDocumentRepository } from '../repositories/document.repository.interface';

@Injectable()
export class GenerateDownloadUrlUseCase {
  constructor(
    @Inject('IDocumentRepository')
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async execute(documentId: string): Promise<{ downloadUrl: string; expiresIn: number }> {
    // 1. Verifica se o documento realmente existe no banco
    const document = await this.documentRepository.findById(documentId);
    
    if (!document) {
      throw new NotFoundException(`Documento com ID ${documentId} não encontrado.`);
    }

    // 2. Simula a assinatura criptográfica da AWS (Signature V4)
    const fakeSignature = Math.random().toString(36).substring(2, 15);
    
    // 3. Monta a URL simulada apontando para o arquivo
    const downloadUrl = `https://inmeta-fake-s3-bucket.s3.amazonaws.com/downloads/${documentId}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-Signature=${fakeSignature}`;

    return {
      downloadUrl,
      expiresIn: 3600,
    };
  }
}