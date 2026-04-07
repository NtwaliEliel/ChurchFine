import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { DeepPartial } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: DeepPartial<User>): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAllByChurch(churchId: string): Promise<User[]> {
    return await this.usersRepository.find({ where: { churchId } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByPhone(churchId: string, phone: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { churchId, phone } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, updateUserDto);
  }
}
