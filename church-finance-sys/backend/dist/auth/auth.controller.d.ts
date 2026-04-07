import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(dto: LoginDto, churchId?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            sub: string;
            churchId: string;
            role: string;
            phone: string;
        };
    }>;
}
