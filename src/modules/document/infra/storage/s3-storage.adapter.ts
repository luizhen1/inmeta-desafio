import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3StorageAdapter {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || 'inmeta-documents-bucket';
    
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.AWS_S3_ENDPOINT || 'http://localhost:4566',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
    });
  }

  async generatePresignedUploadUrl(fileKey: string, contentType: string): Promise<{ url: string; expiresIn: number }> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
      ChecksumAlgorithm: undefined,
    });

    const expiresIn = 900; 
    
    // Passamos a opção para ignorar o Flexible Checksums
    const url = await getSignedUrl(this.s3Client, command, { 
      expiresIn,
      unhoistableHeaders: new Set(['x-amz-checksum-crc32']) 
    });

    return { url, expiresIn };
  }

  async generatePresignedDownloadUrl(fileKey: string): Promise<{ url: string; expiresIn: number }> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    const expiresIn = 900;
    const url = await getSignedUrl(this.s3Client, command, { expiresIn });

    return { url, expiresIn };
  }
}