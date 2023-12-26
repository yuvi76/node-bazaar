import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for creating a product.
 */
export class CreateProductDto {
  /**
   * The name of the product.
   */
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'iPhone 12 Pro' })
  name: string;

  /**
   * The slug of the product.
   */
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'iphone-12-pro' })
  slug: string;

  /**
   * The description of the product.
   */
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'The latest iPhone model' })
  description: string;

  /**
   * The price of the product.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 999.99 })
  price: number;

  /**
   * The count of the product in stock.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 10 })
  countInStock: number;

  /**
   * The status of the product.
   */
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  status: boolean;

  /**
   * The rating of the product.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 4.5 })
  rating: number;

  /**
   * The number of reviews for the product.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 100 })
  numberOfReviews: number;

  /**
   * The brand of the product.
   */
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Apple' })
  brand: string;

  /**
   * The category of the product.
   */
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Electronics' })
  category: string;

  /**
   * The images of the product.
   */
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'] })
  image: string[];

  /**
   * The sizes available for the product.
   */
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: ['S', 'M', 'L'] })
  size: string[];

  /**
   * The colors available for the product.
   */
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: ['Red', 'Blue', 'Green'] })
  color: string[];

  /**
   * The tags associated with the product.
   */
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: ['tag1', 'tag2', 'tag3'] })
  tags: string[];

  /**
   * Indicates if the product is a today's deal.
   */
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  todayDeals: boolean;

  /**
   * Indicates if the product is featured.
   */
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  featured: boolean;

  /**
   * Indicates if the product is seller featured.
   */
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  sellerFeatured: boolean;

  /**
   * Indicates if the product supports cash on delivery.
   */
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  cashOnDelivery: boolean;

  /**
   * Indicates if the product offers free shipping.
   */
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  freeShipping: boolean;

  /**
   * The minimum quantity of the product that can be ordered.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  minQuantity: number;

  /**
   * The discount percentage of the product.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 10 })
  discount: number;

  /**
   * The type of discount applied to the product.
   */
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'percentage' })
  discountType: string;

  /**
   * The tax percentage applied to the product.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 18 })
  tax: number;

  /**
   * The type of tax applied to the product.
   */
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'percentage' })
  taxType: string;

  /**
   * The shipping cost of the product.
   */
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 5 })
  shippingCost: number;
}
