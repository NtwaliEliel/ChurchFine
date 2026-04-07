import { type AuthUser } from '../common/decorators/current-user.decorator';
import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly service;
    constructor(service: TransactionsService);
    listMine(user: AuthUser, limit?: string): Promise<import("./entities/transaction.entity").Transaction[]>;
    getOne(user: AuthUser, id: string): Promise<import("./entities/transaction.entity").Transaction>;
    listChurch(user: AuthUser, limit?: string): Promise<import("./entities/transaction.entity").Transaction[]>;
}
