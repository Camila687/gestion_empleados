import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { DocumentType } from './document-type.entity';

@Entity('t_employee_documents')
export class Document {

  @PrimaryColumn()
  documentTypeId: number;

  @PrimaryColumn()
  employeeId: number;

  @Column()
  s3_key: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @ManyToOne(() => DocumentType)
  @JoinColumn({ name: 'documentTypeId' })
  documentType: DocumentType;
}
