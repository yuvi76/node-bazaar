import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard, Roles, ROLE, BaseResponse } from '@app/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CacheKey } from '@nestjs/cache-manager';

/**
 * Controller for managing categories.
 */
@ApiBearerAuth()
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Creates a new category.
   * @param createCategoryDto The data for creating the category.
   * @returns The created category.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<BaseResponse> {
    return await this.categoryService.create(createCategoryDto);
  }

  /**
   * Get all categories.
   * @returns All categories.
   */
  @Get()
  @CacheKey('getAllCategories')
  async getCategories(): Promise<BaseResponse> {
    return await this.categoryService.getAllCategories();
  }

  /**
   * Get one category.
   * @param categoryId The ID of the category to retrieve.
   * @returns One category.
   */
  @Get(':categoryId')
  async getCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<BaseResponse> {
    return await this.categoryService.getCategory(categoryId);
  }

  /**
   * Update one category.
   * @param categoryId The ID of the category to update.
   * @param updateCategoryDto The data for updating the category.
   * @returns One category.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  @Post(':categoryId')
  @ApiBody({
    schema: {
      example: {
        name: 'New Category',
        description: 'New Category Description',
      },
    },
  })
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<BaseResponse> {
    return this.categoryService.updateCategory(categoryId, updateCategoryDto);
  }

  /**
   * Delete one category.
   * @param categoryId The ID of the category to delete.
   * @returns One category.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  @Delete('/delete/:categoryId')
  async deleteCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<BaseResponse> {
    return this.categoryService.deleteCategory(categoryId);
  }
}
