import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Vérifier si l'utilisateur existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // 2. Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    // 4. Retourner le token et l'utilisateur sans le mot de passe
    return this.generateToken(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    // 1. Trouver l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // 2. Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // 3. Générer et retourner le token JWT
    return this.generateToken(user.id, user.email, user.role);
  }

  private async generateToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: {
        id: userId,
        email,
        role,
      },
    };
  }
}