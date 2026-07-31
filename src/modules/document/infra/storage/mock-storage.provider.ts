import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3StorageAdapter {
  private s3Client: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET_NAME || 'inmeta-documents-bucket';

  constructor() {
    // Inicializamos o cliente da AWS apontando para o nosso LocalStack
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_S3_ENDPOINT,
      forcePathStyle: true, 
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  // Gera a URL para o Front-end fazer o Upload
  async generateUploadUrl(fileKey: string, contentType: string): Promise<{ url: string; expiresIn: number }> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
    });

    const expiresIn = 900;

    const url = await getSignedUrl(this.s3Client, command, { expiresIn });

    return { url, expiresIn };
  }

  // Gera a URL para o Front-end fazer o Download
  async generateDownloadUrl(fileKey: string): Promise<{ url: string; expiresIn: number }> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    const expiresIn = 900;
    const url = await getSignedUrl(this.s3Client, command, { expiresIn });

    return { url, expiresIn };
  }
}