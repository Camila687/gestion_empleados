import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    if (!user || !user.email) {
      throw new UnauthorizedException('Invalid user data');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      isAdmin: user.isAdmin 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    };
  }

  async createAdminUser() {
    try {
      const adminExists = await this.usersRepository.findOne({ 
        where: { isAdmin: true } 
      });
      
      if (adminExists) {
        return adminExists;
      }

      const hashedPassword = await bcrypt.hash('admin', 10);
      const admin = this.usersRepository.create({
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true,
      });

      return await this.usersRepository.save(admin);
    } catch (error) {
      if (error.code === '23505') { 
        throw new ConflictException('Admin user already exists');
      }
      throw error;
    }
  }

  private async validatePassword(password: string): Promise<boolean> {
    return password.length >= 6;
  }
  
}