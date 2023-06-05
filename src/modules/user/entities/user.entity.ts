import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  login: string;

  @Exclude()
  password: string;

  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(partial: UserEntity) {
    this.id = partial.id;
    this.login = partial.login;
    this.password = partial.password;
    this.version = partial.version;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
  }
}