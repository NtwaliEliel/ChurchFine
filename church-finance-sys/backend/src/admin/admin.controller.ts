import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';

@Controller({ path: 'admin', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('dashboard')
  dashboard(@CurrentUser() user: AuthUser) {
    return this.service.dashboard(user.churchId);
  }
}

