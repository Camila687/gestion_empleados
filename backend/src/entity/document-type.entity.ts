import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('t_document_types')
export class DocumentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

}