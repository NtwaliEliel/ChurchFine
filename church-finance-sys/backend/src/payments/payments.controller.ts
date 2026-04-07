import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentsService } from './payments.service';

@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('initiate')
  initiate(
    @CurrentUser() user: AuthUser,
    @Body() dto: InitiatePaymentDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.paymentsService.initiatePayment({
      churchId: user.churchId,
      userId: user.sub,
      dto,
      idempotencyKey: idempotencyKey?.trim() || undefined,
    });
  }

  /**
   * Public MTN webhook endpoint.
   * Deploy behind HTTPS and set `WEBHOOK_SECRET` so only your MoMo callback gateway can call it.
   */
  @Post('webhook/mtn')
  webhookMtn(@Body() payload: any, @Headers('x-webhook-secret') secret?: string) {
    return this.paymentsService.handleMtnWebhook({
      secretHeader: secret,
      expectedSecret: this.configService.get<string>('WEBHOOK_SECRET') ?? undefined,
      payload,
    });
  }
}

