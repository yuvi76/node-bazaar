import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for getting a list of reviews.
 */
export class GetReviewsListDto {
  /**
   * The product ID of the review.
   */
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '60d4e1e5f3f4b93c74f4d689' })
  product: string;

  /**
   * The page number.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  page: number;

  /**
   * The number of items per page.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 10 })
  limit: number;

  /**
   * The sort order.
   */
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  order: boolean;

  /**
   * The search term.
   */
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'good' })
  search: string;
}
