import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

/**
 * Local strategy for passport authentication.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validates the username and password for authentication.
   * @param username - The username to validate.
   * @param password - The password to validate.
   * @returns A Promise that resolves to the authenticated user.
   * @throws UnauthorizedException if the user is not authorized.
   */
  async validate(username: string, password: string) {
    try {
      return await this.authService.verifyUser(username, password);
    } catch (error) {
      throw error;
    }
  }
}
