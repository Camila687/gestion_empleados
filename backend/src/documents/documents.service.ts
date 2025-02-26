import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entity/document.entity';
import { DocumentType } from '../entity/document-type.entity';
import { Employee } from '../entity/employee.entity';
import { S3Service } from './s3.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(DocumentType)
    private documentTypesRepository: Repository<DocumentType>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private s3Service: S3Service,
  ) {
    this.initDocumentTypes();
  }

  private async initDocumentTypes() {
    const count = await this.documentTypesRepository.count();
    if (count === 0) {
      const types = [
        { name: 'Identificación' },
        { name: 'Licencia de conducir' },
        { name: 'CV' },
      ];
      
      for (const type of types) {
        await this.documentTypesRepository.save(this.documentTypesRepository.create(type));
      }
    }
  }

  async findAllTypes(): Promise<DocumentType[]> {
    return this.documentTypesRepository.find();
  }

  async uploadDocument(
    employeeId: number,
    documentTypeId: number,
    file: Express.Multer.File,
  ): Promise<Document> {
    const employee = await this.employeesRepository.findOne({ where: { id: employeeId } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    const documentType = await this.documentTypesRepository.findOne({ where: { id: documentTypeId } });
    if (!documentType) {
      throw new NotFoundException(`Document type with ID ${documentTypeId} not found`);
    }

    const key = `employees/${employeeId}/${documentTypeId}/${Date.now()}_${file.originalname}`;
    await this.s3Service.uploadFile(file, key);

    const document = this.documentsRepository.create({
      documentType: documentType,
      s3_key: key,
      employee: employee,
      is_active: true,
    });

    return this.documentsRepository.save(document);
  }

  async findAllByEmployee(employeeId: number): Promise<Document[]> {
    return this.documentsRepository.find({
      where: { employee: { id: employeeId } },
    });
  }

  async getDocumentUrl(documentTyped: number, employeed: number): Promise<string> {
    const document = await this.documentsRepository.findOne({ where: { documentTypeId: documentTyped, employeeId:employeed } });
    if (!document) {
      throw new NotFoundException(`Document with ID ${documentTyped} and employee ID ${employeed} not found`);
    }

    return this.s3Service.getSignedUrl(document.s3_key);
  }
}