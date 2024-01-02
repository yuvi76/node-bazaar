import { IsString } from 'class-validator';

/**
 * Data transfer object for notifying a user.
 */
export class NotifyUserDto {
  /**
   * The user's identifier.
   */
  @IsString()
  user: string;

  /**
   * The user's email address.
   */
  @IsString()
  userEmail: string;

  /**
   * The type of notification.
   */
  @IsString()
  type: string;

  /**
   * The notification message.
   */
  @IsString()
  message: string;
}
