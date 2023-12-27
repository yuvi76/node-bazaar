import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { BaseResponse, JwtAuthGuard, ROLE, Roles } from '@app/common';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductListDto } from './dto/get-product-list.dto';
import { EventPattern } from '@nestjs/microservices';

/**
 * Controller for managing products.
 */
@ApiBearerAuth()
@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Create a new product.
   * @param createProductDto The data for creating the product.
   * @returns The created product.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<BaseResponse> {
    return await this.productService.create(createProductDto);
  }

  /**
   * Retrieves a list of products based on the provided criteria.
   * @param getProductListDto - The DTO containing the criteria for retrieving the products.
   * @returns A Promise that resolves to a BaseResponse containing the list of products.
   */
  @Post('getAllProducts')
  async getProducts(
    @Body() getProductListDto: GetProductListDto,
  ): Promise<BaseResponse> {
    return await this.productService.getAllProducts(getProductListDto);
  }

  /**
   * Get all products featured on the home page.
   * @returns All products featured on the home page.
   */
  @Get('/Featured')
  async getFeaturedProducts(): Promise<BaseResponse> {
    return await this.productService.getFeaturedProducts();
  }

  /**
   * Get one product.
   * @param productId The ID of the product to retrieve.
   * @returns The product with the specified ID.
   */
  @Get('/:productId')
  async getProduct(
    @Param('productId') productId: string,
  ): Promise<BaseResponse> {
    return await this.productService.getProduct(productId);
  }

  /**
   * Retrieves a list of products for a specific category.
   *
   * @param categoryId - The ID of the category.
   * @param getProductListDto - The DTO containing additional parameters for retrieving the product list.
   * @returns A promise that resolves to a BaseResponse object.
   */
  @Post('category/:categoryId')
  async getProductsForCategory(
    @Param('categoryId') categoryId: string,
    @Body() getProductListDto: GetProductListDto,
  ): Promise<BaseResponse> {
    return await this.productService.getProductsForCategory(
      categoryId,
      getProductListDto,
    );
  }

  /**
   * Updates the rating of a product.
   * @param productId The ID of the product to update.
   * @returns A promise that resolves to the updated product.
   */
  @EventPattern('update_product_rating')
  async updateProductRating(productId: string): Promise<boolean> {
    return await this.productService.updateProductRating(productId);
  }
}
