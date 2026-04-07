export declare const ROLES_KEY = "roles";
export type Role = 'member' | 'admin' | 'super_admin';
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
