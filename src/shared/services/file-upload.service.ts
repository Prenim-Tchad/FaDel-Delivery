import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import multer from 'multer';

@Injectable()
export class FileUploadService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error('R2 configuration is missing');
    }

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<string> {
    const bucketName = this.configService.get<string>('R2_BUCKET_NAME');
    const publicUrl = this.configService.get<string>('R2_PUBLIC_URL');

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.originalname.split('.').pop();
    const fileName = `${folder}/${timestamp}-${randomString}.${extension}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' as const,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      return `${publicUrl}/${fileName}`;
    } catch (error) {
      console.error('Error uploading file to R2:', error);
      throw new Error('Failed to upload file');
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'uploads',
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }
}