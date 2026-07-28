import { Injectable } from '@nestjs/common';
import { IStorageProvider, PresignedUrlResponse } from './storage.provider.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class MockStorageProvider implements IStorageProvider {
  async generatePresignedUploadUrl(
    fileName: string,
    mimeType: string,
    fileSizeInBytes: number,
  ): Promise<PresignedUrlResponse> {
    const fileKey = `documents/${randomUUID()}-${fileName}`;

    // Converte bytes para uma string legível ex: 1.5MB
    const sizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

    const uploadUrl = `https://inmeta-documents-bucket.s3.amazonaws.com/${fileKey}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=MOCK_CREDENTIAL&X-Amz-Date=20260728T000000Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host%3Bcontent-length&content-length=${fileSizeInBytes}&X-Amz-Signature=mock_signature_hash_12345`;

    return {
      uploadUrl,
      fileKey,
      expiresInSeconds: 900,
    };
  }
}