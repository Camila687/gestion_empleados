import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../entity/document.entity';
import { DocumentType } from '../entity/document-type.entity';
import { Employee } from '../entity/employee.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { S3Service } from './s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document, DocumentType, Employee])],
  providers: [DocumentsService, S3Service],
  controllers: [DocumentsController],
})
export class DocumentsModule {}