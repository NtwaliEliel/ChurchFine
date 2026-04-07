import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(private readonly repo: TransactionsRepository) {}

  listMyTransactions(churchId: string, userId: string, limit?: number) {
    return this.repo.listByUser(churchId, userId, limit);
  }

  listChurchTransactions(churchId: string, limit?: number) {
    return this.repo.listByChurch(churchId, limit);
  }

  async getOne(churchId: string, id: string) {
    const tx = await this.repo.findById(churchId, id);
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }
}

