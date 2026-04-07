import { type AuthUser } from '../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly service;
    constructor(service: AdminService);
    dashboard(user: AuthUser): Promise<{
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
