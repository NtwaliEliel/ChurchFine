import { Repository } from 'typeorm';
import type { DeepPartial } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: DeepPartial<User>): Promise<User>;
    findAllByChurch(churchId: string): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByPhone(churchId: string, phone: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
}
