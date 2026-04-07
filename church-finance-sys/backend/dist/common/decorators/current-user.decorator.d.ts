export type AuthUser = {
    sub: string;
    churchId: string;
    role: 'member' | 'admin' | 'super_admin';
    phone: string;
};
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
