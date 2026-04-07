import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
export declare class TransactionsRepository {
    private readonly repo;
    constructor(repo: Repository<Transaction>);
    create(tx: Partial<Transaction>): Transaction;
    save(tx: Transaction): Promise<Transaction>;
    findById(churchId: string, id: string): Promise<Transaction | null>;
    findByIdGlobal(id: string): Promise<Transaction | null>;
    findByIdempotencyKey(churchId: string, idempotencyKey: string): Promise<Transaction | null>;
    listByUser(churchId: string, userId: string, limit?: number): Promise<Transaction[]>;
    listByChurch(churchId: string, limit?: number): Promise<Transaction[]>;
    markSuccessful(churchId: string, id: string, momoReference?: string): Promise<void>;
    markFailed(churchId: string, id: string, failureReason: string): Promise<void>;
    countByStatus(churchId: string, status: TransactionStatus): Promise<number>;
    sumSuccessfulSince(churchId: string, start: Date): Promise<number>;
}
