import { TransactionsRepository } from './transactions.repository';
export declare class TransactionsService {
    private readonly repo;
    constructor(repo: TransactionsRepository);
    listMyTransactions(churchId: string, userId: string, limit?: number): Promise<import("./entities/transaction.entity").Transaction[]>;
    listChurchTransactions(churchId: string, limit?: number): Promise<import("./entities/transaction.entity").Transaction[]>;
    getOne(churchId: string, id: string): Promise<import("./entities/transaction.entity").Transaction>;
}
