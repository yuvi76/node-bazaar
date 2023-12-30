import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { TokenInterface } from './interface/token-payload-interface';
import {
  BaseResponse,
  MESSAGE,
  ErrorHandlerService,
  UserDocument,
} from '@app/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UsersRepository } from './users.repository';

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
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Verifies the user's email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns The verified user.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = bcryptjs.compareSync(password, user.password);
    if (!passwordIsValid || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  /**
   * Validates the user data for creating a new user.
   * @param createUserDto - The data for creating a new user.
   * @throws UnauthorizedException if the user already exists.
   */
  private async validateUserCreateUserDto(createUserDto: CreateUsersDto) {
    const user = await this.usersRepository.findOne({
      email: createUserDto.email,
    });
    if (user) throw new UnauthorizedException('User already exists');
  }

  /**
   * Registers a user.
   * @param user - The user document.
   * @returns A promise that resolves to a BaseResponse object.
   */
  async register(createUserDto: CreateUsersDto): Promise<BaseResponse> {
    try {
      // Create the user
      await this.validateUserCreateUserDto(createUserDto);
      const user = await this.usersRepository.create({
        ...createUserDto,
        password: bcryptjs.hashSync(createUserDto.password, 10),
      });

      // Return the response
      return {
        statusCode: HttpStatus.CREATED,
        message: MESSAGE.USER_CREATED_SUCCESS,
        data: user,
      };
    } catch (error) {
      // Handle the error
      await this.errorHandlerService.HttpException(error);
    }
  }

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

  /**
   * Retrieves a user based on the provided criteria.
   * @param userId - The user ID.
   * @returns The retrieved user.
   */
  async getUser(userId: string) {
    try {
      return this.usersRepository.findOne({ _id: userId });
    } catch (error) {
      // Handle the error here
      await this.errorHandlerService.HttpException(error);
    }
  }
}
