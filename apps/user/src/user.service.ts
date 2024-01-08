import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  BaseResponse,
  MESSAGE,
  ErrorHandlerService,
  UserDocument,
} from '@app/common';
import { UserRepository } from './user.repository';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Service class for managing user data.
 */
@Injectable()
export class UserService {
  /**
   * Creates an instance of UserService.
   * @param userRepository The injected UserRepository instance.
   * @param userModel The injected mongoose model for users.
   */
  constructor(
    private readonly userRepository: UserRepository,
    @InjectModel(UserDocument.name)
    private readonly userModel: mongoose.Model<UserDocument>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  /**
   * Get the current user.
   * @param user - The current user.
   * @returns The current user.
   */
  async getCurrentUser(user: UserDocument): Promise<BaseResponse> {
    try {
      const currentUser = await this.userRepository.findOne({
        _id: user._id,
      });
      currentUser.address.sort((a, b) => {
        return Number(b.isDefault) - Number(a.isDefault);
      });
      delete currentUser.password;
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.USER_RETRIEVED_SUCCESS,
        data: currentUser,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Updates the current user.
   * @param user - The current user.
   * @param updateUserAddressDto - The data for updating the current user.
   * @returns A promise that resolves to a BaseResponse object.
   */
  async updateUserAddress(
    user: UserDocument,
    updateUserAddressDto: UpdateUserAddressDto,
  ): Promise<BaseResponse> {
    try {
      const currentUser = await this.userModel.findOne({
        _id: user._id,
      });

      if (updateUserAddressDto.address.isDefault) {
        currentUser.address.forEach((address) => {
          address.isDefault = false;
        });
        currentUser.markModified('address');
        await currentUser.save();
      }

      updateUserAddressDto.address._id = new mongoose.Types.ObjectId().toString();

      const updatedUser = await this.userRepository.findOneAndUpdate(
        { _id: user._id },
        { $push: updateUserAddressDto },
      );
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.USER_UPDATED_SUCCESS,
        data: updatedUser,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Updates the current user.
   * @param user - The current user.
   * @param updateUserDto - The data for updating the current user.
   * @returns A promise that resolves to a BaseResponse object.
   */
  async updateUser(
    user: UserDocument,
    updateUserDto: UpdateUserDto,
  ): Promise<BaseResponse> {
    try {
      const updatedUser = await this.userRepository.findOneAndUpdate(
        { _id: user._id },
        updateUserDto,
      );
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.USER_UPDATED_SUCCESS,
        data: updatedUser,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Update One Address
   * @param user - The current user.
   * @param updateUserAddressDto - The data for updating the current user.
   * @returns A promise that resolves to a BaseResponse object.
   */
  async updateOneAddress(
    user: UserDocument,
    updateUserAddressDto: UpdateUserAddressDto,
  ): Promise<BaseResponse> {
    try {
      const currentUser = await this.userModel.findOne({
        _id: user._id,
      });

      if (updateUserAddressDto.address.isDefault) {
        currentUser.address.forEach((address) => {
          address.isDefault = false;
        });
        currentUser.markModified('address');
        await currentUser.save();
      }

      const updatedUser = await this.userRepository.findOneAndUpdate(
        { _id: user._id, 'address._id': updateUserAddressDto.address._id },
        {
          $set: {
            'address.$.street': updateUserAddressDto.address.street,
            'address.$.city': updateUserAddressDto.address.city,
            'address.$.state': updateUserAddressDto.address.state,
            'address.$.zip': updateUserAddressDto.address.zip,
            'address.$.country': updateUserAddressDto.address.country,
            'address.$.isDefault': updateUserAddressDto.address.isDefault,
          },
        },
      );
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.USER_UPDATED_SUCCESS,
        data: updatedUser,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
