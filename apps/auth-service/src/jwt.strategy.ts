import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'super-secret', // In production, use env variable
    });
  }

  validate(payload: { sub: number; username: string }) {
    // This payload will be the decrypted JWT token
    return { userId: payload.sub, username: payload.username };
  }
}
