import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for creating a user.
 */
export class CreateUsersDto {
  /**
   * The name of the user.
   */
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * The email of the user.
   */
  @ApiProperty({ example: 'john.doe@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The password of the user.
   */
  @ApiProperty({ example: 'password' })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  /**
   * The role of the user.
   */
  @ApiProperty({ example: 'user' })
  @IsOptional()
  @IsString()
  role?: string;
}
