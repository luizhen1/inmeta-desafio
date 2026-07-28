import { Inject, Injectable } from '@nestjs/common';
import type { IStorageProvider, PresignedUrlResponse } from '../../infra/storage/storage.provider.interface';

@Injectable()
export class GenerateUploadUrlUseCase {
    constructor(
        @Inject('IStorageProvider')
        private readonly storageProvider: IStorageProvider,
    ) { }

    async execute(fileName: string, mimeType: string, fileSizeInBytes: number): Promise<PresignedUrlResponse> {
        return this.storageProvider.generatePresignedUploadUrl(fileName, mimeType, fileSizeInBytes);
    }
}