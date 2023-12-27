import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository, ReviewsDocument } from '@app/common';

/**
 * Repository class for managing reviews data.
 */
@Injectable()
export class ReviewsRepository extends AbstractRepository<ReviewsDocument> {
  /**
   * Logger instance for logging repository operations.
   */
  protected readonly logger = new Logger(ReviewsRepository.name);

  /**
   * Creates an instance of ReviewsRepository.
   * @param reviewsModel The injected Mongoose model for ReviewsDocument.
   */
  constructor(
    @InjectModel(ReviewsDocument.name)
    reviewsModel: Model<ReviewsDocument>,
  ) {
    super(reviewsModel);
  }
}
