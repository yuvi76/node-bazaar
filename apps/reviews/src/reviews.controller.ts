import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import {
  BaseResponse,
  CurrentUser,
  JwtAuthGuard,
  ROLE,
  Roles,
  UserDocument,
} from '@app/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewsListDto } from './dto/get-review-list.dto';

/**
 * Controller for managing reviews.
 */
@ApiBearerAuth()
@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Create a new reviews.
   * @param createReviewDto The data for creating the reviews.
   * @returns The created reviews.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.USER)
  @Post()
  async createReviews(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: UserDocument,
  ): Promise<BaseResponse> {
    return await this.reviewsService.create(createReviewDto, user);
  }

  /**
   * Retrieves a list of reviews based on the provided criteria.
   * @param getReviewsListDto - The DTO containing the criteria for retrieving the reviews.
   * @returns A Promise that resolves to a BaseResponse containing the list of reviews.
   */
  @Post('getAllReviews')
  async getReviews(
    @Body() getReviewsListDto: GetReviewsListDto,
  ): Promise<BaseResponse> {
    return await this.reviewsService.getReviews(getReviewsListDto);
  }

  /**
   * Get one reviews.
   * @param reviewsId The ID of the reviews to retrieve.
   * @returns The reviews with the specified ID.
   */
  @Get('/:reviewsId')
  async getReviewById(
    @Param('reviewsId') reviewsId: string,
  ): Promise<BaseResponse> {
    return await this.reviewsService.getReviewById(reviewsId);
  }

  /**
   * Delete one review by id.
   * @param reviewsId The ID of the reviews to delete.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.USER)
  @Post('/delete/:reviewsId')
  async deleteReviewById(
    @Param('reviewsId') reviewsId: string,
  ): Promise<BaseResponse> {
    return await this.reviewsService.deleteReviewById(reviewsId);
  }
}
