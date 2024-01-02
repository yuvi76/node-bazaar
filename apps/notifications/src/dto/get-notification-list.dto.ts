import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for getting a list of notifications.
 */
export class GetNotificationListDto {
  /**
   * The page number.
   */
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  /**
   * The page limit.
   */
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  limit: number;
}
