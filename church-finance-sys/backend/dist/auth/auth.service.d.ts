import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            sub: string;
            churchId: string;
            role: string;
            phone: string;
        };
    }>;
    login(dto: LoginDto, churchId: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            sub: string;
            churchId: string;
            role: string;
            phone: string;
        };
    }>;
    private issueTokens;
}
