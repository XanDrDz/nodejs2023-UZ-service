import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as process from 'process';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'refreshStrategy',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_REFRESH_KEY,
    });
  }

  async validate(payload) {
    console.log('refresh-strategy');
    return payload;
  }
}
