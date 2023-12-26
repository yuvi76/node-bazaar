import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, CategoryDocument } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/**
 * Repository class for managing category data.
 */
@Injectable()
export class CategoryRepository extends AbstractRepository<CategoryDocument> {
  /**
   * Logger instance for logging repository operations.
   */
  protected readonly logger = new Logger(CategoryRepository.name);

  /**
   * Creates an instance of CategoryRepository.
   * @param categoryModel The injected Mongoose model for CategoryDocument.
   */
  constructor(
    @InjectModel(CategoryDocument.name) categoryModel: Model<CategoryDocument>,
  ) {
    super(categoryModel);
  }
}
