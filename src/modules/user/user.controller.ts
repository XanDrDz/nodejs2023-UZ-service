import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { validationID } from '../../utils/utils';
import { CreateUserDto, UpdatePasswordDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()

  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string) {
    validationID(id);
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    if (!createUserDto || !createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Login and password are required');
    }

    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async updateUserPassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    validationID(id);
    if (
      !updatePasswordDto ||
      !updatePasswordDto.oldPassword ||
      !updatePasswordDto.newPassword
    ) {
      throw new BadRequestException('Password and old password are required');
    }
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updatePasswordDto.newPassword === updatePasswordDto.oldPassword)
      throw new ForbiddenException('You can not write the same password');
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Invalid old password');
    }

    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    validationID(id);
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userService.deleteUser(id);
  }
}
