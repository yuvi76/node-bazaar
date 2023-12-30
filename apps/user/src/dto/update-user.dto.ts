import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for Address.
 */
class Address {
  /**
   * The street of the address.
   */
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsOptional()
  street: string;

  /**
   * The city of the address.
   */
  @ApiProperty({ example: 'San Francisco' })
  @IsString()
  @IsOptional()
  city: string;

  /**
   * The state of the address.
   */
  @ApiProperty({ example: 'CA' })
  @IsString()
  @IsOptional()
  state: string;

  /**
   * The zip code of the address.
   */
  @ApiProperty({ example: '94105' })
  @IsString()
  @IsOptional()
  zip: string;

  /**
   * The country of the address.
   */
  @ApiProperty({ example: 'USA' })
  @IsString()
  @IsOptional()
  country: string;

  /**
   * The isDefault of the address.
   */
  @ApiProperty({ example: true })
  @IsOptional()
  isDefault: boolean;
}

/**
 * Data transfer object for creating a user.
 */
export class UpdateUserDto {
  /**
   * The name of the user.
   */
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name: string;

  /**
   * The email of the user.
   */
  @ApiProperty({ example: 'john.doe@gmail.com' })
  @IsEmail()
  @IsOptional()
  email: string;

  /**
   * The password of the user.
   */
  @ApiProperty({ example: 'password' })
  @IsStrongPassword()
  @IsOptional()
  password: string;

  /**
   * The role of the user.
   */
  @ApiProperty({ example: 'user' })
  @IsOptional()
  @IsString()
  role?: string;

  /**
   * The address of the user.
   */
  @ApiProperty({
    example: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA',
      isDefault: true,
    },
  })
  @IsOptional()
  address?: Address;
}
