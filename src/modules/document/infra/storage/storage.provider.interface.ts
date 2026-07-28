export interface PresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
  expiresInSeconds: number;
}

export interface IStorageProvider {
  generatePresignedUploadUrl(
    fileName: string,
    mimeType: string,
    fileSizeInBytes: number,
  ): Promise<PresignedUrlResponse>;
}