import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from './models/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private db: DbService) {}

  getAllUsers(): UserEntity[] {
    return this.db.users;
  }

  getUserById(id: string): UserEntity | undefined {
    return this.db.users.find((user: User) => user.id === id);
  }

  getUserByLogin(id: string): UserEntity | undefined {
    return this.db.users.find((user: User) => user.id === id);
  }

  async createUser({ login, password }: CreateUserDto) {
    const hash = await this.hashPassword(password);
    if (!hash) throw new Error();
    const newUser = new UserEntity({
      id: uuidv4(),
      login: login,
      password: hash,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    this.db.users.push(newUser);
    return newUser;
  }

  async update(id: string, { oldPassword, newPassword }) {
    const user = await this.getUserById(id);

    if (!user)
      throw new NotFoundException(`User with id:${id} doesn't not exist`);
    const match = await compare(oldPassword, user.password);
    if (!match) throw new ForbiddenException('Old password is wrong');
    if (oldPassword === newPassword)
      throw new ForbiddenException('You can not write the same password');

    user.password = await this.hashPassword(newPassword);
    user.version += 1
    user.updatedAt = Date.now()
    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async validateUser({ login, password }: CreateUserDto) {
    const user = await this.db.users.find((user: User) => user.login === login);
    if (!user)
      throw new ForbiddenException({
        message: `User with login: ${login} is not exist`,
      });
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword)
      throw new ForbiddenException({
        message: `User password: ${password} is incorrect`,
      });
    return user;
  }

  deleteUser(id: string): void {
    const index = this.db.users.findIndex((user: User) => user.id === id);
    this.db.users.splice(index, 1);
  }
}
