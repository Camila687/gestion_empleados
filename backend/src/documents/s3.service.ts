import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class S3Service {
  private s3Client: S3Client | null = null;
  private bucket: string;
  private isLocalStorage: boolean = false;
  private localStoragePath: string = 'uploads';

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('aws.region');
    const accessKeyId = this.configService.get<string>('aws.accessKeyId');
    const secretAccessKey = this.configService.get<string>('aws.secretAccessKey');

    if (region && accessKeyId && secretAccessKey && accessKeyId !== 'default' && secretAccessKey !== 'default') {
      this.s3Client = new S3Client({
        region: region,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        },
      });

      this.bucket = this.configService.get<string>('aws.s3Bucket') || 'default-bucket';
    } else {
      console.log('AWS credentials not found, using local storage');
      this.isLocalStorage = true;
      if (!fs.existsSync(this.localStoragePath)) {
        fs.mkdirSync(this.localStoragePath, { recursive: true });
      }
    }
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    if (this.isLocalStorage) {
      return this.saveLocally(file, key);
    }

    if (!this.s3Client) {
        throw new Error('S3 client is not initialized.');
    }

    const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return key;
  }

  async getSignedUrl(key: string): Promise<string> {
    if (this.isLocalStorage) {
      return `http://localhost:3000/uploads/${key}`;
    }

    if (!this.s3Client) {
        throw new Error('S3 client is not initialized.');
    }

    const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  private async saveLocally(file: Express.Multer.File, key: string): Promise<string> {
    const filePath = path.join(this.localStoragePath, key);
    const fileDir = path.dirname(filePath);

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    await fs.promises.writeFile(filePath, file.buffer);
    return key;
  }


}