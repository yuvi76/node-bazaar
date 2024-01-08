import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseResponse, ProductDocument, ReviewsDocument } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { MESSAGE, ErrorHandlerService } from '@app/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductListDto } from './dto/get-product-list.dto';

/**
 * Service class for managing product data.
 */
@Injectable()
export class ProductService {
  /**
   * Creates an instance of ProductService.
   * @param productRepository The injected ProductRepository instance.
   * @param productModel The injected ProductModel instance.
   */
  constructor(
    private readonly productRepository: ProductRepository,
    @InjectModel(ProductDocument.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ReviewsDocument.name)
    private readonly reviewsModel: Model<ReviewsDocument>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  /**
   * Creates a new product.
   * @param createProductDto - The data for creating the product.
   * @returns A promise that resolves to the created product document.
   */
  async create(createProductDto: CreateProductDto): Promise<BaseResponse> {
    try {
      const slug = createProductDto.name.toLowerCase().replace(/ /g, '-');
      const existingProduct = await this.productRepository.findOne({
        $or: [{ name: createProductDto.name }, { slug }],
      });

      if (existingProduct) {
        throw new ConflictException(MESSAGE.PRODUCT_ALREADY_EXIST);
      }

      createProductDto.slug = slug;
      const product = await this.productRepository.create(createProductDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: MESSAGE.PRODUCT_CREATED,
        data: product,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Retrieves a list of products based on the provided filters.
   * @param getProductListDto - The DTO containing the filters for retrieving the products.
   * @returns A Promise that resolves to a BaseResponse object containing the retrieved products and total count.
   */
  async getAllProducts(
    getProductListDto: GetProductListDto,
  ): Promise<BaseResponse> {
    try {
      const {
        page,
        limit,
        sort,
        order,
        search,
        category,
        minPrice,
        maxPrice,
        minRating,
      } = getProductListDto;

      const pipeline = [];

      // filter by search term
      if (search) {
        pipeline.push({
          $match: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
            ],
          },
        });
      }

      pipeline.push(
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category',
        },
      );

      // filter by category
      if (category) {
        pipeline.push({
          $match: {
            'category.name': { $regex: category, $options: 'i' },
          },
        });
      }

      // filter by price
      if (minPrice || maxPrice) {
        const priceFilter: any = {};
        if (minPrice) {
          priceFilter.$gte = minPrice;
        }
        if (maxPrice) {
          priceFilter.$lte = maxPrice;
        }

        pipeline.push({
          $match: {
            price: priceFilter,
          },
        });
      }

      // filter by rating
      if (minRating) {
        pipeline.push({
          $match: {
            rating: { $gte: minRating },
          },
        });
      }

      // sort by field
      if (sort) {
        const sortField = {};
        sortField[sort] = order === 'asc' ? 1 : -1;
        pipeline.push({
          $sort: sortField,
        });
      }

      // add limit and skip
      pipeline.push({
        $facet: {
          finalProducts: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      });

      // execute pipeline
      const [result] = await this.productModel.aggregate(pipeline);
      const { finalProducts, totalCount } = result;

      // format response
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.PRODUCTS_RETRIEVED,
        data: {
          products: finalProducts,
          totalCount: totalCount[0]?.count ? totalCount[0].count : 0,
        },
      };
    } catch (error) {
      // Handle the error here
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Get all products featured on the home page.
   * @returns All products featured on the home page.
   */
  async getFeaturedProducts(): Promise<BaseResponse> {
    try {
      const products = await this.productRepository.find({ featured: true });
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.PRODUCTS_RETRIEVED,
        data: products,
      };
    } catch (error) {
      // Handle the error here
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Get one product.
   * @param productId The ID of the product to retrieve.
   * @returns One product.
   */
  async getProduct(productId: string): Promise<BaseResponse> {
    try {
      const [product] = await this.productModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(productId),
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category',
        },
      ]);

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.PRODUCT_RETRIEVED,
        data: product,
      };
    } catch (error) {
      // Handle the error here
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Retrieves products for a specific category based on the provided filters.
   * @param categoryId - The ID of the category.
   * @param getProductListDto - The DTO (Data Transfer Object) containing the filters for retrieving the products.
   * @returns A promise that resolves to a BaseResponse object containing the retrieved products and total count.
   */
  async getProductsForCategory(
    categoryId: string,
    getProductListDto: GetProductListDto,
  ): Promise<BaseResponse> {
    try {
      const {
        page,
        limit,
        sort,
        order,
        maxPrice,
        minPrice,
        search,
        minRating,
      } = getProductListDto;

      const pipeline = [];

      pipeline.push({
        $match: {
          category: new mongoose.Types.ObjectId(categoryId),
        },
      });

      // filter by search term
      if (search) {
        pipeline.push({
          $match: {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
            ],
          },
        });
      }

      // filter by price
      if (minPrice || maxPrice) {
        const priceFilter: any = {};
        if (minPrice) {
          priceFilter.$gte = minPrice;
        }
        if (maxPrice) {
          priceFilter.$lte = maxPrice;
        }

        pipeline.push({
          $match: {
            price: priceFilter,
          },
        });
      }

      // filter by rating
      if (minRating) {
        pipeline.push({
          $match: {
            rating: { $gte: minRating },
          },
        });
      }

      // sort by field
      if (sort) {
        const sortField = {};
        sortField[sort] = order === 'asc' ? 1 : -1;
        pipeline.push({
          $sort: sortField,
        });
      }

      // add limit and skip
      pipeline.push({
        $facet: {
          finalProducts: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      });

      // execute pipeline
      const [result] = await this.productModel.aggregate(pipeline);
      const { finalProducts, totalCount } = result;

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.PRODUCTS_RETRIEVED,
        data: {
          products: finalProducts,
          totalCount: totalCount[0].count,
        },
      };
    } catch (error) {
      // Handle the error here
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Updates the rating of a product.
   * @param productId The ID of the product to update.
   * @returns A promise that resolves to the updated product.
   */
  async updateProductRating(productId: string): Promise<boolean> {
    try {
      const [reviews] = await this.reviewsModel.aggregate([
        {
          $match: { product: new mongoose.Types.ObjectId(productId) },
        },
        {
          $group: {
            _id: '$product',
            rating: { $avg: '$rating' },
            numberOfReviews: { $sum: 1 },
          },
        },
        {
          $addFields: {
            rating: { $round: ['$rating', 1] },
          },
        },
      ]);
      await this.productModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(productId) },
        [
          {
            $set: {
              rating: reviews.rating,
              numberOfReviews: reviews.numberOfReviews,
            },
          },
        ],
      );
      return true;
    } catch (error) {
      // Handle the error here
      await this.errorHandlerService.HttpException(error);
    }
  }
}
