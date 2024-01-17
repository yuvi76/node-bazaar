import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  BaseResponse,
  CurrentUser,
  JwtAuthGuard,
  UserDocument,
} from '@app/common';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Controller for managing users.
 */
@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get the current user.
   * @param user - The current user.
   * @returns The current user.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(
    @CurrentUser() user: UserDocument,
  ): Promise<BaseResponse> {
    return await this.userService.getCurrentUser(user);
  }

  /**
   * Update the current user address.
   * @param user - The current user.
   * @param updateUserAddressDto - The data for updating the current user.
   * @returns A promise that resolves to a BaseResponse object.
   */
  @UseGuards(JwtAuthGuard)
  @Post('update-user-address')
  async updateUserAddress(
    @CurrentUser() user: UserDocument,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
  ): Promise<BaseResponse> {
    return await this.userService.updateUserAddress(user, updateUserAddressDto);
  }

  /**
   * Update the current user.
   * @param user - The current user.
   * @param updateUserDto - The data for updating the current user.
   * @returns A promise that resolves to a BaseResponse object.
   */
  @UseGuards(JwtAuthGuard)
  @Post('update-user')
  async updateUser(
    @CurrentUser() user: UserDocument,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<BaseResponse> {
    return await this.userService.updateUser(user, updateUserDto);
  }

  /**
   * Update One Address
   * @param user - The current user.
   * @param updateUserAddressDto - The data for updating the current user.
   * @returns A promise that resolves to a BaseResponse object.
   */
  @UseGuards(JwtAuthGuard)
  @Post('update-one-address')
  async updateOneAddress(
    @CurrentUser() user: UserDocument,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
  ): Promise<BaseResponse> {
    return await this.userService.updateOneAddress(user, updateUserAddressDto);
  }
}
