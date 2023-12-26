import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for creating a category.
 */
export class CreateCategoryDto {
  /**
   * The name of the category.
   */
  @ApiProperty({ example: 'Category 1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * The description of the category.
   */
  @ApiProperty({ example: 'Category 1 description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
