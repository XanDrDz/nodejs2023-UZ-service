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
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  getAllUsers(): UserEntity[] {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string): UserEntity {
    validationID(id);
    const user = this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto || !createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Login and password are required');
    }

    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  updateUserPassword(
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

    return this.userService.update(id, updatePasswordDto);
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    validationID(id);
    const user = this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.userService.deleteUser(id);
  }
}
