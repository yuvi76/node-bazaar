import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { TokenInterface } from '../interface/token-payload-interface';

/**
 * Represents a JWT strategy used for authentication.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * JwtStrategy constructor.
   * @param configService - The configuration service.
   * @param authService - The authentication service.
   */
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication ||
          request?.Authentication ||
          request?.headers.Authentication,
      ]), // Extract the JWT token from the request header.
      secretOrKey: configService.get('JWT_SECRET'), // The secret key used to sign the JWT token.
    });
  }

  /**
   * Validate the JWT token and retrieve the user associated with it.
   * @param token - The JWT token.
   * @returns The user associated with the token.
   */
  async validate({ userId }: TokenInterface) {
    return this.authService.getUser(userId);
  }
}
