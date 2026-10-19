import { Controller, Post, Body, HttpCode, HttpStatus, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Redirige vers l'écran de connexion Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const googleUser = req.user;

    // Inscription automatique ou connexion via Prisma
    const authResult = await this.authService.validateGoogleUser({
      email: googleUser.email,
      firstName: googleUser.firstName,
      lastName: googleUser.lastName,
    });

    // Redirige vers ton Front-end (Next.js) avec le token JWT
    const frontendUrl = 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/?token=${authResult.access_token}`);
  }
}