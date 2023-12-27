import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for creating a review.
 */
export class CreateReviewDto {
  /**
   * The product ID of the review.
   */
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '60d4e1e5f3f4b93c74f4d689' })
  product: string;

  /**
   * The rating of the review.
   */
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 5 })
  rating: number;

  /**
   * The review of the review.
   */
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'This is a review' })
  review: string;
}
