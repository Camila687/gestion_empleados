import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    if (!req.user.isAdmin) {
      throw new Error('Unauthorized');
    }
    return this.employeesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getMyProfile(@Request() req) {
    console.log('Usuario autenticado:', req.user);
    return this.employeesService.findByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const employee = this.employeesService.findOne(+id);
    return employee;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto, @Request() req) {
    if (!req.user.isAdmin) {
      throw new Error('Unauthorized');
    }
    return this.employeesService.create(createEmployeeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: any, @Request() req) {
    if (!req.user.isAdmin) {
      throw new Error('Unauthorized');
    }
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    if (!req.user.isAdmin) {
      throw new Error('Unauthorized');
    }
    return this.employeesService.remove(+id);
  }
}