import { Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthGuard,
  ROLE,
  Roles,
  UserDocument,
} from '@app/common';

/**
 * Controller for managing orders.
 */
@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Creates a new order.
   * @param createOrderDto The data for creating the order.
   * @returns The created order.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.USER)
  @Post('/placeOrder')
  async placeOrder(@CurrentUser() user: UserDocument) {
    return await this.ordersService.placeOrder(user);
  }

  /**
   * Get all orders.
   * @returns All orders.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Get('/getAllOrders')
  async getAllOrders(@CurrentUser() user: UserDocument) {
    return await this.ordersService.getAllOrders(user);
  }

  /**
   * Get one order.
   * @param orderId The id of the order to get.
   * @returns The order with the specified id.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @Get('/getOrder/:orderId')
  async getOrder(
    @CurrentUser() user: UserDocument,
    @Param('orderId') orderId: string,
  ) {
    return await this.ordersService.getOrder(user, orderId);
  }

  /**
   * Get all orders for a user.
   * @param userId The id of the user to get orders for.
   * @returns All orders for the specified user.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  @Get('/getOrdersByUser/:userId')
  async getOrdersByUser(@Param('userId') userId: string) {
    return await this.ordersService.getOrdersByUser(userId);
  }

  /**
   * Update an order.
   * @param orderId The id of the order to update.
   */
  @UseGuards(JwtAuthGuard)
  @Roles(ROLE.ADMIN)
  @Put('/updateOrder/:orderId')
  async updateOrder(@Param('orderId') orderId: string) {
    return await this.ordersService.updateOrder(orderId);
  }
}
