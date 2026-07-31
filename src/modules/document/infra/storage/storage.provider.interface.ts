export interface PresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
  expiresInSeconds: number;
}

export interface PresignedDownloadUrlResponse {
  url: string;
  expiresIn: number;
}

export interface IStorageProvider {
  generatePresignedUploadUrl(
    fileName: string,
    mimeType: string,
    fileSizeInBytes: number,
  ): Promise<PresignedUrlResponse>;

  generatePresignedDownloadUrl(
    fileKey: string,
  ): Promise<PresignedDownloadUrlResponse>;
}