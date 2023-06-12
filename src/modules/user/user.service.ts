import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.userRepository.find();
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ?? null;
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
    this.userRepository.create(newUser);
    return newUser;
  }

  async updatePassword(id, data) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException('Track not found');
    }
    await this.userRepository.update(id, data);
    const updatedTrack = await this.getUserById(id);
    return updatedTrack;
  }

  async deleteUser(id: string) {
    // const user = await this.getUserById(id);
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }
    return this.userRepository.delete(id)
  }
}
