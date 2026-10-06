import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private hashPassword(password: string): string {
    const salt = 'textguard_salt_2026';
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  async register(dto: RegisterDto) {
    const emailNormalized = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = this.hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: emailNormalized,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    await this.prisma.globalStats.upsert({
      where: { id: 'global_metrics' },
      update: { totalUsers: { increment: 1 } },
      create: { id: 'global_metrics', totalUsers: 1 },
    });

    return {
      message: 'Registered successfully',
      user,
    };
  }

  async login(dto: LoginDto) {
    const emailNormalized = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = this.hashPassword(dto.password) === user.passwordHash;
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      message: 'Logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
}
