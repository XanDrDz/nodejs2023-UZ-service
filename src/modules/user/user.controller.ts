import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { validationID } from '../../utils/utils';
import { CreateUserDto, UpdatePasswordDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllUsers() {
    this.userService.getAllUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string) {
    validationID(id);
    const user = this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto || !createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Login and password are required');
    }

    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateUserPassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('id') id: string,
  ) {
    validationID(id);
    const user = this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Invalid old password');
    }

    user.password = updatePasswordDto.newPassword;
    user.version++;
    user.updatedAt = Date.now();

    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    validationID(id);
    const user = this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.userService.deleteUser(id);
  }
}
