import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenInterface } from './interface/token-payload-interface';
import {
  BaseResponse,
  MESSAGE,
  ErrorHandlerService,
  UserDocument,
} from '@app/common';

/**
 * Service responsible for handling authentication-related operations.
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService.
   * @param configService - The configuration service.
   * @param jwtService - The JWT service.
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  /**
   * Logs in a user and send the authentication token
   * @param user - The user document.
   * @returns A promise that resolves to a BaseResponse object.
   */
  async login(user: UserDocument): Promise<BaseResponse> {
    try {
      // Create the token payload
      const tokenPayload: TokenInterface = {
        userId: user._id.toHexString(),
      };

      // Calculate the token expiration time
      const expires = new Date();
      expires.setSeconds(
        expires.getSeconds() + this.configService.get('JWT_EXPIRATION_TIME'),
      );

      // Generate the JWT token
      const accessToken = this.jwtService.sign(tokenPayload);
      delete user.password;

      // Return the response
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.LOGIN_SUCCESS,
        data: {
          accessToken,
          user,
        },
      };
    } catch (error) {
      // Handle the error
      await this.errorHandlerService.HttpException(error);
    }
  }
}
