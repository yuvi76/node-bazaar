import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { CreateUsersDto } from './dto/create-users.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';
import { BaseResponse, MESSAGE, ErrorHandlerService } from '@app/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  /**
   * Creates a new user.
   * @param createUserDto - The data for creating a new user.
   * @returns The created user.
   * @throws UnauthorizedException if the user already exists.
   */
  async create(createUserDto: CreateUsersDto): Promise<BaseResponse> {
    try {
      await this.validateUserCreateUserDto(createUserDto);
      const user = await this.usersRepository.create({
        ...createUserDto,
        password: bcryptjs.hashSync(createUserDto.password, 10),
        role: 'user',
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: MESSAGE.USER_CREATED_SUCCESS,
        data: user,
      };
    } catch (error) {
      // Handle the error here
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Validates the user data for creating a new user.
   * @param createUserDto - The data for creating a new user.
   * @throws UnauthorizedException if the user already exists.
   */
  private async validateUserCreateUserDto(createUserDto: CreateUsersDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      return;
    }
    throw new UnauthorizedException('User already exists');
  }

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
   * Retrieves a user based on the provided criteria.
   * @param getUserDto - The criteria for retrieving a user.
   * @returns The retrieved user.
   */
  async getUser(getUserDto: GetUserDto) {
    try {
      return this.usersRepository.findOne(getUserDto);
    } catch (error) {
      // Handle the error here
      await this.errorHandlerService.HttpException(error);
    }
  }
}
