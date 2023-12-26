import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for creating a cart.
 */
export class CreateCartDto {
  /**
   * The product ID associated with the cart.
   */
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '60f1b8f9f0f6f1f9f0f6f1f9' })
  product: string;

  /**
   * The quantity of the product in the cart.
   */
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  quantity: number;
}
