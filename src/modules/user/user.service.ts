import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from './models/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private db: DbService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  getAllUsers(): UserEntity[] {
    return this.db.users;
  }

  getUserById(id: string): UserEntity | undefined {
    return this.db.users.find((user: User) => user.id === id);
  }

  createUser(createUserDto: CreateUserDto): UserEntity {
    const newUser = new UserEntity({
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    this.db.users.push(newUser);
    return newUser;
  }

  deleteUser(id: string): void {
    const index = this.db.users.findIndex((user: User) => user.id === id);
    this.db.users.splice(index, 1);
  }
}
