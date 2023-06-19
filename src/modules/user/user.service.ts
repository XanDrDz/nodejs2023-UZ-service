import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
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

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = new UserEntity({
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return await this.userRepository.save(newUser);
  }

  async updatePassword(id, data) {
    const user = await this.getUserById(id);
    user.password = data.newPassword;
    user.updatedAt = Number(Date.now());
    user.createdAt = Number(user.createdAt);
    user.version += 1;

    const updatedUser = await this.userRepository.save(user);
    if (!updatedUser) {
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedUser;
  }

  async deleteUser(id: string) {
    return await this.userRepository.delete(id);
  }
}
