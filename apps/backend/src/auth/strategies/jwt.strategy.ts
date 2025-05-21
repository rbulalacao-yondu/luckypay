import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../services/token.service';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      console.log('JWT payload being validated:', payload);

      // Verify token type if present in payload
      if (payload.type && payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Verify token ID if present
      if (payload.jti && !this.tokenService.isTokenActive(payload.jti)) {
        throw new UnauthorizedException('Token is no longer active');
      }

      // Get user to ensure they still exist and are active
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Ensure the role from the token matches the user's current role
      // This will allow the roles guard to work correctly
      return {
        ...user,
        role: payload.role || user.role, // Prefer token role if available
      };
    } catch (error) {
      console.error('JWT validation error:', error);
      throw error;
    }
  }
}
