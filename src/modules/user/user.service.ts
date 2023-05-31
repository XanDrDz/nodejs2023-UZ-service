import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from './models/user.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private db: DbService) {}

  getAllUsers(): User[] {
    return this.db.users;
  }

  getUserById(id: string): User | undefined {
    return this.db.users.find((user: User) => user.id === id);
  }

  createUser(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.db.users.push(newUser);
    return newUser;
  }

  deleteUser(id: string): void {
    const index = this.db.users.findIndex((user: User) => user.id === id);
    this.db.users.splice(index, 1);
  }
}
