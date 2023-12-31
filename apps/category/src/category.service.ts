import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from './category.repository';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BaseResponse, MESSAGE, ErrorHandlerService } from '@app/common';

/**
 * Service class for managing category data.
 */
@Injectable()
export class CategoryService {
  /**
   * Creates an instance of CategoryService.
   * @param categoryRepository The injected CategoryRepository instance.
   */
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  /**
   * Checks if a category already exists in the database.
   * @param createCategoryDto - The DTO containing the category information.
   * @throws ConflictException if the category already exists.
   */
  private async checkCategoryExists(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      name: createCategoryDto.name,
    });
    if (category) throw new ConflictException(MESSAGE.CATEGORY_ALREADY_EXIST);
  }

  /**
   * Creates a new category.
   * @param createCategoryDto - The data for creating a new category.
   * @returns The created category.
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<BaseResponse> {
    try {
      await this.checkCategoryExists(createCategoryDto);
      const category = await this.categoryRepository.create(createCategoryDto);

      return {
        statusCode: HttpStatus.CREATED,
        message: MESSAGE.CATEGORY_CREATED,
        data: category,
      };
    } catch (error) {
      // Handle the error here
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Get all categories.
   * @returns All categories.
   */
  async getAllCategories(): Promise<BaseResponse> {
    try {
      const categories = await this.categoryRepository.find({});

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.CATEGORIES_RETRIEVED,
        data: categories,
      };
    } catch (error) {
      // Handle the error here
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Get one category.
   * @param categoryId - The ID of the category to retrieve.
   * @returns One category.
   */
  async getCategory(categoryId: string): Promise<BaseResponse> {
    try {
      const category = await this.categoryRepository.findOne({
        _id: categoryId,
      });

      if (!category) {
        throw new NotFoundException(MESSAGE.CATEGORY_NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.CATEGORY_RETRIEVED,
        data: category,
      };
    } catch (error) {
      // Handle the error here
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Update one category.
   * @param categoryId - The ID of the category to update.
   * @param updateCategoryDto - The data for updating the category.
   * @returns One category.
   */
  async updateCategory(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<BaseResponse> {
    try {
      const category = await this.categoryRepository.findOneAndUpdate(
        { _id: categoryId },
        updateCategoryDto,
      );

      if (!category) {
        throw new NotFoundException(MESSAGE.CATEGORY_NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.CATEGORY_UPDATED,
        data: category,
      };
    } catch (error) {
      // Handle the error here
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Delete one category.
   * @param categoryId - The ID of the category to delete.
   * @returns One category.
   */
  async deleteCategory(categoryId: string): Promise<BaseResponse> {
    try {
      const category = await this.categoryRepository.findOneAndDelete({
        _id: categoryId,
      });

      if (!category) {
        throw new NotFoundException(MESSAGE.CATEGORY_NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.CATEGORY_DELETED,
      };
    } catch (error) {
      // Handle the error here
      await this.errorHandlerService.HttpException(error);
    }
  }
}
