import { IsEmail, IsNotEmpty, IsNumber, IsString, Min, IsOptional } from 'class-validator';

export class CreateEmployeeDto {
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsNotEmpty()
    @IsString()
    job_title: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    salary: number;

    @IsOptional()
    @IsNumber()
    document: string; 

    @IsOptional()
    @IsString()
    password?: string;
}