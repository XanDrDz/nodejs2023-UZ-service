import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/decorator.public';
import { ValidationRefreshPipe } from './pipes/validationRefresh.pipe';
import { JwtRefreshAuthGuard } from './guards/refresh-auth.guard';
import { Token } from './types/token.type';
import { UserEntity } from '../user/entities/user.entity';

@Public()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() createUserDto: CreateUserDto): Promise<Token> {
    return await this.authService.signin(createUserDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    console.log('signup-controller');
    return await this.authService.signup(createUserDto);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Body('refreshToken', new ValidationRefreshPipe())
    refreshToken: string,
  ): Promise<Token> {
    return await this.authService.refresh(refreshToken);
  }
}
