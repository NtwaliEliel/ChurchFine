import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { UsersService } from '../users/users.service';
import { TransactionStatus } from '../transactions/entities/transaction.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly txRepo: TransactionsRepository,
    private readonly usersService: UsersService,
  ) {}

  async dashboard(churchId: string) {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = now.getUTCMonth();
    const monthStart = new Date(Date.UTC(y, m, 1));
    const yearStart = new Date(Date.UTC(y, 0, 1));

    const [monthTotal, yearTotal] = await Promise.all([
      this.txRepo.sumSuccessfulSince(churchId, monthStart),
      this.txRepo.sumSuccessfulSince(churchId, yearStart),
    ]);

    const [pending, failed] = await Promise.all([
      this.txRepo.countByStatus(churchId, TransactionStatus.PENDING),
      this.txRepo.countByStatus(churchId, TransactionStatus.FAILED),
    ]);

    const members = (await this.usersService.findAllByChurch(churchId)).length;

    return {
      totals: {
        month: monthTotal,
        year: yearTotal,
      },
      counts: { members, pending, failed },
    };
  }
}

