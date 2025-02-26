import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class SeedInitialData1740160783226 implements MigrationInterface {
    name = 'SeedInitialData1740160783226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const hashedPassword2 = await bcrypt.hash('employ123', 10);

        // Data t_users
        await queryRunner.query(`
            INSERT INTO "t_users" 
            ("first_name", "last_name", "email", "password","isAdmin") 
            VALUES 
            ('Cesar', 'Perez', 'admin@company.com', '${hashedPassword}',true),
            ('Gian', 'Campos', 'employee@company.com', '${hashedPassword2}',false)
        `);

        // Data t_document_types
        await queryRunner.query(`
            INSERT INTO "t_document_types" 
            ("name") 
            VALUES 
            ('DNI'),
            ('Licencia de Conducir'),
            ('CV')
        `);

        const adminUser = await queryRunner.query(`SELECT id FROM "t_users" WHERE email = 'admin@company.com'`);
        const employeeUser = await queryRunner.query(`SELECT id FROM "t_users" WHERE email = 'employee@company.com'`);

        await queryRunner.query(`
            INSERT INTO "t_employees" 
            ("job_title", "salary", "document","user_id") 
            VALUES 
            ('CEO', 10000.00, '78945612', ${adminUser[0].id}),
            ('Software Developer', 5000.00, '78912365',${employeeUser[0].id})
        `);

        const dniType = await queryRunner.query(`SELECT id FROM "t_document_types" WHERE name = 'DNI'`);
        const cvType = await queryRunner.query(`SELECT id FROM "t_document_types" WHERE name = 'CV'`);

        await queryRunner.query(`
            INSERT INTO "t_employee_documents" 
            ("documentTypeId", "s3_key", "employeeId", "is_active") 
            VALUES 
            (${dniType[0].id}, 'admin-dni-s3key', ${adminUser[0].id}, true),
            (${cvType[0].id}, 'employee-cv-s3key', ${employeeUser[0].id}, true)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "t_employee_documents" WHERE "documentName" = 'Admin DNI'`);
        await queryRunner.query(`DELETE FROM "t_employee_documents" WHERE "documentName" = 'Employee CV'`);
        await queryRunner.query(`DELETE FROM "t_employees" WHERE "job_title" = 'CEO'`);
        await queryRunner.query(`DELETE FROM "t_employees" WHERE "job_title" = 'Software Developer'`);
        await queryRunner.query(`DELETE FROM "t_users" WHERE "email" = 'admin@company.com'`);
        await queryRunner.query(`DELETE FROM "t_document_types"`);
    }
}