import { Church } from '../../churches/entities/church.entity';
export declare class GivingCategory {
    id: string;
    churchId: string;
    church: Church;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
