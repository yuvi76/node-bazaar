import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { NotifyUserDto } from './dto/notify-user.dto';
import { GetNotificationListDto } from './dto/get-notification-list.dto';
import {
  CurrentUser,
  JwtAuthGuard,
  ROLE,
  Roles,
  UserDocument,
} from '@app/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

/**
 * Controller responsible for handling notifications.
 */
@Controller('notifications')
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Event handler for notifying a user.
   * @param notifyUserDto - The data required to notify the user.
   * @returns A promise that resolves when the user is notified.
   */
  @EventPattern('notify_user')
  async notifyUser(@Payload() notifyUserDto: NotifyUserDto) {
    return this.notificationsService.notifyUser(notifyUserDto);
  }

  /**
   * Retrieves a list of notifications based on the provided criteria.
   * @param user - The user to retrieve notifications for.
   * @param getNotificationListDto - The DTO containing the criteria for retrieving the notifications.
   * @returns A Promise that resolves to a BaseResponse containing the list of notifications.
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.USER)
  @Post('GetAllNotifications')
  async getAllNotifications(
    @CurrentUser() user: UserDocument,
    @Body() getNotificationListDto: GetNotificationListDto,
  ) {
    return await this.notificationsService.getAllNotifications(
      user,
      getNotificationListDto,
    );
  }

  /**
   * Mark all notification as read.
   * @param user - The user to mark notifications as read for.
   * @returns A Promise that resolves to a BaseResponse containing the list of notifications.
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.USER)
  @Get('MarkAllAsRead')
  async markAllAsRead(@CurrentUser() user: UserDocument) {
    return await this.notificationsService.markAllAsRead(user);
  }
}
