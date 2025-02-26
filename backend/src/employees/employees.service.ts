import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entity/employee.entity';
import { User } from '../entity/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<any[]> {
    const employees = await this.employeesRepository.find({
      relations: ['user'],
    });

    employees.forEach(employee => {
      console.log(employee);
    });

    return employees.map(employee => ({
            id: employee.id,
            first_name: employee.user ? employee.user.first_name : 'N/A',
            last_name: employee.user ? employee.user.last_name : 'N/A',
            email: employee.user ? employee.user.email : 'N/A',
            job_title: employee.job_title,
            salary: employee.salary,
            document: employee.document,
    }));
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    
    return employee;
  }

  async findByUserId(userId: number): Promise<any> {
    const employee = await this.employeesRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    
    if (!employee) {
      throw new NotFoundException(`Employee for user ID ${userId} not found`);
    }
    
    return {
      id: employee.id,
      firstName: employee.user.first_name,
      lastName: employee.user.last_name,
      email: employee.user.email,
      job_title: employee.job_title,
      salary: employee.salary,
      document: employee.document,
      department: 'N/A', 
      documents: []
    };
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createEmployeeDto.email },
    });
    
    if (existingUser) {
      throw new BadRequestException(`User with email ${createEmployeeDto.email} already exists`);
    }
  
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    const newUser = this.usersRepository.create({
      first_name: createEmployeeDto.first_name, 
      last_name: createEmployeeDto.last_name,
      email: createEmployeeDto.email,
      password: hashedPassword,
      isAdmin: false,
    });
    
    const savedUser = await this.usersRepository.save(newUser);
    
    const newEmployee = this.employeesRepository.create({
      id: savedUser.id,
      job_title: createEmployeeDto.job_title,
      salary: createEmployeeDto.salary,
      document: createEmployeeDto.document,
      user: savedUser,
      user_id: savedUser.id,
    });
    
    const savedEmployee = await this.employeesRepository.save(newEmployee);
    
    return {
      ...savedEmployee,
      tempPassword,
    } as any;
  }

  async update(id: number, updateEmployeeDto: any): Promise<Employee> {
    const employee = await this.findOne(id);

    if (updateEmployeeDto.job_title) employee.job_title = updateEmployeeDto.job_title;
    if (updateEmployeeDto.salary) employee.salary = updateEmployeeDto.salary;
    if (updateEmployeeDto.document) employee.document = updateEmployeeDto.document;

    if (updateEmployeeDto.first_name || updateEmployeeDto.last_name || updateEmployeeDto.email) {
      const user = await this.usersRepository.findOne({ where: { id: employee.id } });
      if (user) {
          if (updateEmployeeDto.first_name) user.first_name = updateEmployeeDto.first_name;
          if (updateEmployeeDto.last_name) user.last_name = updateEmployeeDto.last_name;
          if (updateEmployeeDto.email) user.email = updateEmployeeDto.email;
          await this.usersRepository.save(user);
      }
    }
    
    return this.employeesRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    try {
        const employee = await this.findOne(id);

        await this.employeesRepository.delete({ user_id: employee.user_id });

        await this.usersRepository.remove(employee.user);
    } catch (error) {
        console.error(`Error al eliminar empleado con ID ${id}:`, error);
        throw new Error(`Error al eliminar empleado con ID ${id}`);
    }
  }
}