import { Church } from '../../churches/entities/church.entity';
export declare enum UserRole {
    MEMBER = "member",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}
export declare class User {
    id: string;
    churchId: string;
    church: Church;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    get fullName(): string;
}
