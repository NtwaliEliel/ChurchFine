import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { type AuthUser } from '../common/decorators/current-user.decorator';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(user: AuthUser): Promise<import("./entities/user.entity").User>;
    findAllInChurch(user: AuthUser): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
}
