import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { BaseResponse, CurrentUser, UserDocument } from '@app/common';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { CreateUsersDto } from './dto/create-users.dto';

/**
 * Controller for handling authentication related endpoints.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint for user registration.
   * @param user - The user to be registered.
   * @returns A promise that resolves to a BaseResponse object.
   */
  @Post('register')
  async register(@Body() createUserDto: CreateUsersDto): Promise<BaseResponse> {
    return await this.authService.register(createUserDto);
  }

  /**
   * Endpoint for user login.
   * @param user - The authenticated user.
   * @returns A promise that resolves to a BaseResponse object.
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    schema: {
      example: {
        email: 'john.doe@gmail.com',
        password: 'password',
      },
    },
  })
  async login(@CurrentUser() user: UserDocument): Promise<BaseResponse> {
    return await this.authService.login(user);
  }

  /**
   * Endpoint for authenticating a user using JWT.
   * @param data - The payload data.
   * @returns A promise that resolves to the authenticated user.
   */
  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
