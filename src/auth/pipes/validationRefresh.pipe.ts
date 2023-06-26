import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ValidationRefreshPipe implements PipeTransform {
  transform(refreshToken: string) {
    if (!refreshToken)
      throw new UnauthorizedException('Access token is required');
    return refreshToken;
  }
}
