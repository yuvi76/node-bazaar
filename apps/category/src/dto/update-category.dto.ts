import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

/**
 * Data transfer object for updating a category.
 * Extends the `CreateCategoryDto` class with partial properties.
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
