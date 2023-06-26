import {
  BadRequestException,
  ForbiddenException, forwardRef, Inject,
  Injectable
} from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../modules/user/user.service';
import { UserEntity } from '../modules/user/entities/user.entity';
import { CreateUserDto } from '../modules/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<UserEntity> {
    let user;
    try {
      user = await this.userService.createUser(createUserDto);
    } catch (e) {
      throw new BadRequestException({
        message: `User with login:${createUserDto.login} has already exist`,
      });
    }
    return user;
  }

  async signin(createUserDto: CreateUserDto) {
    const user = await this.userService.validateUser(createUserDto);
    return this.getToken(user);
  }

  async getToken({ id, login }: UserEntity) {
    const payload = { userId: id, login: login };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const { userId, login } = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          ignoreExpiration: false,
        },
      );
      const user = await this.userService.getUserByLogin(login);
      if (!user || user.id !== userId)
        throw new ForbiddenException({ message: `User is not exist` });
      return this.getToken(user);
    } catch (e) {
      throw new ForbiddenException({ message: 'Invalid RefreshToken' });
    }
  }
}
