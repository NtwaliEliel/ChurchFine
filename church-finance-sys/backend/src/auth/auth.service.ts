import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByPhone(dto.churchId, dto.phone);
    if (existing) throw new ConflictException('Phone already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      churchId: dto.churchId,
      phone: dto.phone,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash,
      role: UserRole.MEMBER,
    });

    return this.issueTokens(user.id, user.churchId, user.role, user.phone);
  }

  async login(dto: LoginDto, churchId: string) {
    const user = await this.usersService.findByPhone(churchId, dto.phone);
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id, user.churchId, user.role, user.phone);
  }

  private async issueTokens(userId: string, churchId: string, role: string, phone: string) {
    const payload = { sub: userId, churchId, role, phone };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
    });
    return { accessToken, refreshToken, user: payload };
  }
}

