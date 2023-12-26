import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Represents the data transfer object for retrieving a user.
 */
export class GetUserDto {
  /**
   * The ID of the user.
   */
  @IsString()
  @IsNotEmpty()
  _id: string;
}
