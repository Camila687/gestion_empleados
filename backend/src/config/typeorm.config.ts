import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../entity/user.entity';
import { Employee } from '../entity/employee.entity';
import { Document } from '../entity/document.entity';
import { DocumentType } from '../entity/document-type.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'gestion_empleados',
  entities: [User, Employee, Document, DocumentType],
  migrations: ['src/migrations/*.ts'],
  synchronize: false
});