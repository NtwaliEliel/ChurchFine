import { BadRequestException, Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Headers('x-church-id') churchId?: string) {
    // Multi-tenant: require church id (kept in header for login, since payload is sensitive).
    // For demo/dev, allow passing churchId inside body by reusing dto validation if needed.
    const resolvedChurchId = churchId?.trim();
    if (!resolvedChurchId) {
      // Intentionally a generic error to avoid leaking tenant existence.
      throw new BadRequestException('Missing x-church-id');
    }
    return this.authService.login(dto, resolvedChurchId);
  }
}

