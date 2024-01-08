import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  BaseResponse,
  CurrentUser,
  JwtAuthGuard,
  ROLE,
  Roles,
  UserDocument,
} from '@app/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';

/**
 * Represents the Cart controller.
 * This controller is responsible for handling incoming requests for the Cart module.
 */
@ApiBearerAuth()
@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Add a product to the cart.
   * @param createCartDto The cart to add the product to.
   * @returns The updated cart.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Post('/addProduct')
  async addProductToCart(
    @Body() createCartDto: CreateCartDto,
    @CurrentUser() user: UserDocument,
  ): Promise<BaseResponse> {
    return await this.cartService.addProductToCart(createCartDto, user);
  }

  /**
   * Get the cart for the logged in user.
   * @returns The cart for the logged in user.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Get()
  async getCart(@CurrentUser() user: UserDocument): Promise<BaseResponse> {
    return await this.cartService.getCart(user);
  }

  /**
   * Clear the cart for the logged in user.
   * @param user The user to clear the cart for.
   * @returns The cart for the logged in user.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Post('/clear')
  async clear(@CurrentUser() user: UserDocument): Promise<BaseResponse> {
    return await this.cartService.clear(user);
  }

  /**
   * Remove a product from the cart.
   * @param productId The product to remove from the cart.
   * @param user The user to remove the product from the cart.
   * @returns The updated cart.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Post('/removeProduct')
  @ApiBody({ schema: { example: { productId: '60a1d8d9b3f7a6e5b4b7b8f0' } } })
  async removeProduct(
    @Body('productId') productId: string,
    @CurrentUser() user: UserDocument,
  ): Promise<BaseResponse> {
    return await this.cartService.removeProduct(productId, user);
  }

  /**
   * Checkout the cart for the logged in user.
   * @param user The user to checkout the cart for.
   * @returns The cart for the logged in user.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Post('/checkout')
  async checkout(@CurrentUser() user: UserDocument): Promise<any> {
    return await this.cartService.checkout(user);
  }

  /**
   * Update the quantity of a product in the cart.
   * @param productId The product to update the quantity for.
   * @param quantity The new quantity for the product.
   * @param user The user to update the quantity for.
   * @returns The updated cart.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Post('/updateQuantity')
  @ApiBody({
    schema: { example: { productId: '60a1d8d9b3f7a6e5b4b7b8f0', quantity: 5 } },
  })
  async updateQuantity(
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
    @CurrentUser() user: UserDocument,
  ): Promise<BaseResponse> {
    return await this.cartService.updateQuantity(productId, quantity, user);
  }
}
