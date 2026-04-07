import { TransactionsRepository } from '../transactions/transactions.repository';
import { UsersService } from '../users/users.service';
export declare class AdminService {
    private readonly txRepo;
    private readonly usersService;
    constructor(txRepo: TransactionsRepository, usersService: UsersService);
    dashboard(churchId: string): Promise<{
        totals: {
            month: number;
            year: number;
        };
        counts: {
            members: number;
            pending: number;
            failed: number;
        };
    }>;
}
