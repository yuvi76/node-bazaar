import { HttpStatus, Injectable } from '@nestjs/common';
import { NotifyUserDto } from './dto/notify-user.dto';
import {
  ErrorHandlerService,
  EmailService,
  NotificationsDocument,
  BaseResponse,
  UserDocument,
  MESSAGE,
} from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { GetNotificationListDto } from './dto/get-notification-list.dto';

/**
 * Service responsible for sending notifications to users and storing them in the database.
 */
@Injectable()
export class NotificationsService {
  constructor(
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly emailService: EmailService,
    @InjectModel(NotificationsDocument.name)
    private readonly notificationsDocument: mongoose.Model<NotificationsDocument>,
  ) {}

  /**
   * Notifies a user by sending an email and storing the notification in the database.
   * @param notifyUserDto - The data required to notify the user.
   */
  async notifyUser(notifyUserDto: NotifyUserDto) {
    try {
      const { user, userEmail, type, message } = notifyUserDto;
      await this.emailService.sendEmail(
        userEmail,
        `${type} Notification - Node-Bazaar`,
        message,
      );
      await this.notificationsDocument.create({
        _id: new mongoose.Types.ObjectId(),
        user,
        type,
        message,
      });
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Retrieves a list of notifications based on the provided criteria.
   * @param user - The user to retrieve notifications for.
   * @param getNotificationListDto - The DTO containing the criteria for retrieving the notifications.
   * @returns A Promise that resolves to a BaseResponse containing the list of notifications.
   */
  async getAllNotifications(
    user: UserDocument,
    getNotificationListDto: GetNotificationListDto,
  ): Promise<BaseResponse> {
    try {
      const { page, limit } = getNotificationListDto;
      const notifications = await this.notificationsDocument
        .find({ user: user._id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      const total = await this.notificationsDocument.countDocuments({
        user: user._id,
      });
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.NOTIFICATIONS_FETCHED_SUCCESS,
        data: {
          notifications,
          total,
        },
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Mark all notification as read.
   * @param user - The user to mark notifications as read for.
   * @returns A Promise that resolves to a BaseResponse containing the list of notifications.
   */
  async markAllAsRead(user: UserDocument): Promise<BaseResponse> {
    try {
      await this.notificationsDocument.updateMany(
        { user: user._id },
        { $set: { isRead: true } },
      );
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.NOTIFICATIONS_MARKED_AS_READ,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
