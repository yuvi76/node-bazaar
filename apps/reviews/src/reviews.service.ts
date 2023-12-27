import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  BaseResponse,
  MESSAGE,
  ErrorHandlerService,
  UserDocument,
  ReviewsDocument,
  PRODUCT_SERVICE,
} from '@app/common';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewsListDto } from './dto/get-review-list.dto';
import { ClientProxy } from '@nestjs/microservices';

/**
 * Service class for managing reviews data.
 */
@Injectable()
export class ReviewsService {
  /**
   * Creates an instance of ReviewsService.
   * @param reviewsRepository The injected ReviewsRepository instance.
   * @param reviewsModel The injected mongoose model for reviews.
   */
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    @InjectModel(ReviewsDocument.name)
    private readonly reviewsModel: mongoose.Model<ReviewsDocument>,
    private readonly errorHandlerService: ErrorHandlerService,
    @Inject(PRODUCT_SERVICE) private readonly productService: ClientProxy,
  ) {}

  /**
   * Creates a new reviews.
   * @param createReviewDto - The data for creating the reviews.
   * @param user - The user creating the reviews.
   * @returns A promise that resolves to the created reviews document.
   */
  async create(
    createReviewDto: CreateReviewDto,
    user: UserDocument,
  ): Promise<BaseResponse> {
    try {
      const existingReview = await this.reviewsRepository.findOne({
        product: createReviewDto.product,
        user: user._id.toString(),
      });
      let review;
      if (existingReview) {
        review = await this.reviewsRepository.findOneAndUpdate(
          { _id: existingReview._id },
          { ...createReviewDto },
        );
      } else {
        review = await this.reviewsRepository.create({
          ...createReviewDto,
          user: user._id.toString(),
        });
      }

      this.productService.emit('update_product_rating', review.product);

      return {
        statusCode: HttpStatus.CREATED,
        message: MESSAGE.REVIEW_CREATED,
        data: review,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Retrieves a list of reviews based on the provided filters.
   * @param getReviewsListDto - The DTO containing the filters for retrieving the reviews.
   * @returns A Promise that resolves to a BaseResponse object containing the retrieved reviews and total count.
   */
  async getReviews(
    getReviewsListDto: GetReviewsListDto,
  ): Promise<BaseResponse> {
    try {
      const { product, page, limit, order, search } = getReviewsListDto;

      const pipeline: any[] = [
        {
          $match: { product: new mongoose.Types.ObjectId(product) },
        },
      ];

      if (search) {
        pipeline.push({
          $match: { review: { $regex: search, $options: 'i' } },
        });
      }
      pipeline.push({
        $sort: { createdAt: order ? 1 : -1 },
      });

      pipeline.push({
        $facet: {
          reviewList: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      });

      const [reviews] = await this.reviewsModel.aggregate(pipeline);
      const { reviewList, totalCount } = reviews;

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.REVIEW_RETRIEVED,
        data: {
          reviewList,
          totalCount: totalCount[0]?.count || 0,
        },
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Get one reviews.
   * @param reviewsId The ID of the reviews to retrieve.
   * @returns The reviews with the specified ID.
   */
  async getReviewById(reviewsId: string): Promise<BaseResponse> {
    try {
      const review = await this.reviewsRepository.findOne({ _id: reviewsId });
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.REVIEW_RETRIEVED,
        data: review,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Delete one review by id.
   * @param reviewsId The ID of the reviews to delete.
   */
  async deleteReviewById(reviewsId: string): Promise<BaseResponse> {
    try {
      const review = await this.reviewsRepository.findOneAndDelete({
        _id: reviewsId,
      });
      this.productService.emit('update_product_rating', review.product);
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.REVIEW_DELETED,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
