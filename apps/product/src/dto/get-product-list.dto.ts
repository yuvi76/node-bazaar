import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents the DTO (Data Transfer Object) for getting a list of products.
 */
export class GetProductListDto {
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
   * The field to sort by.
   */
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'name' })
  sort: string;

  /**
   * The sort order.
   */
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'asc' })
  order: string;

  /**
   * The search term.
   */
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'iPhone' })
  search: string;

  /**
   * The category ID.
   */
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'mobile' })
  category: string;

  /**
   * The minimum price.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 100 })
  minPrice: number;

  /**
   * The maximum price.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1000 })
  maxPrice: number;

  /**
   * The minimum rating.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 0 })
  minRating: number;
}
