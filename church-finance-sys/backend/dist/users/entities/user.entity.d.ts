export declare enum UserRole {
    MEMBER = "MEMBER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
    FINANCE_OFFICER = "FINANCE_OFFICER"
}
export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED"
}
export declare class User {
    id: string;
    phone_number: string;
    full_name: string;
    password_hash: string;
    role: UserRole;
    church_id: string;
    is_salaried: boolean;
    status: UserStatus;
    created_at: Date;
    updated_at: Date;
}
