import { Controller, Post, UseGuards, Request, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// DTO login
class LoginDto {
  email: string;
  password: string;
}

// Interface usuario
interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    isAdmin: boolean;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

  @Post('init-admin')
  @HttpCode(HttpStatus.CREATED)
  async initAdmin() {
    return this.authService.createAdminUser();
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('verify')
  @HttpCode(HttpStatus.OK)
  verifyToken() {
    return { isValid: true };
  }
}