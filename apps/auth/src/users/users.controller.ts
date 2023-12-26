import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { BaseResponse, CurrentUser, MESSAGE, UserDocument } from '@app/common';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

/**
 * Controller for handling user-related operations.
 */
@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user.
   * @param createUsersDto - The data for creating a new user.
   * @returns The created user.
   */
  @Post()
  async createUser(
    @Body() createUsersDto: CreateUsersDto,
  ): Promise<BaseResponse> {
    return this.usersService.create(createUsersDto);
  }

  /**
   * Get the current user.
   * @param user - The current user.
   * @returns The current user.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: UserDocument): Promise<BaseResponse> {
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGE.USER_RETRIEVED_SUCCESS,
      data: user,
    };
  }
}
