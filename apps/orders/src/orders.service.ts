import {
  Injectable,
  HttpStatus,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import {
  BaseResponse,
  MESSAGE,
  ErrorHandlerService,
  OrdersDocument,
  CartDocument,
  PAYMENTS_SERVICE,
  UserDocument,
  ORDER_STATUS,
  NOTIFICATIONS_SERVICE,
  ProductDocument,
} from '@app/common';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { OrdersRepository } from './orders.repository';

/**
 * Service class for managing order data.
 */
@Injectable()
export class OrdersService {
  /**
   * Creates an instance of OrdersService.
   * @param ordersRepository The injected OrdersRepository instance.
   * @param errorHandlerService The injected ErrorHandlerService instance.
   * @param ordersDocument The injected OrdersDocument instance.
   * @param paymentsService The injected ClientProxy instance.
   */
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly errorHandlerService: ErrorHandlerService,
    @InjectModel(OrdersDocument.name)
    readonly ordersDocument: mongoose.Model<OrdersDocument>,
    @InjectModel(CartDocument.name)
    readonly cartDocument: mongoose.Model<CartDocument>,
    @InjectModel(ProductDocument.name)
    readonly productDocument: mongoose.Model<ProductDocument>,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  /**
   * Place a new order.
   * @param createOrderDto The data for creating the order.
   * @returns The created order.
   */
  async placeOrder(user: UserDocument): Promise<any> {
    try {
      if (!user.address.length) {
        throw new BadRequestException(MESSAGE.Add_ADDRESS_TO_ORDER);
      }
      const cart = await this.cartDocument.findOne({ user: user._id });
      if (!cart) {
        throw new NotFoundException(MESSAGE.CART_NOT_FOUND);
      }
      const product = await this.productDocument.findOne({
        _id: cart.products[0].product,
      });
      if (product.countInStock < cart.products[0].quantity) {
        throw new BadRequestException(MESSAGE.PRODUCT_NOT_IN_STOCK);
      }
      return this.paymentsService
        .send('create_checkout_session', cart._id)
        .pipe(
          map(async (res) => {
            await this.cartDocument.deleteMany({ user: user._id });
            const [address] = user.address.filter(
              (address) => address.isDefault,
            );
            this.notificationsService.emit('notify_user', {
              user: user._id,
              userEmail: user.email,
              type: 'Order Placed',
              message: `Your order has been placed successfully.`,
            });
            await this.productDocument.findOneAndUpdate(
              { _id: cart.products[0].product },
              { $inc: { countInStock: -cart.products[0].quantity } },
            );
            return this.ordersRepository.create({
              user: user._id.toString(),
              products: cart.products,
              totalPrice: cart.totalCartPrice,
              checkoutSessionId: res.id,
              checkoutUrl: res.url,
              status: ORDER_STATUS.PENDING,
              deliveryAddress: address,
            });
          }),
        );
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Get all orders.
   * @returns All orders.
   */
  async getAllOrders(user: UserDocument): Promise<BaseResponse> {
    try {
      const orders = await this.ordersDocument.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(user._id),
          },
        },
        {
          $unwind: { path: '$products', preserveNullAndEmptyArrays: true },
        },
        {
          $addFields: {
            'products.product': {
              $toObjectId: '$products.product',
            },
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'products.product',
          },
        },
        {
          $unwind: '$products.product',
        },
        {
          $group: {
            _id: '$_id',
            products: {
              $push: '$products',
            },
            totalPrice: {
              $first: '$totalPrice',
            },
            createdAt: {
              $first: '$createdAt',
            },
          },
        },
        {
          $project: {
            _id: 1,
            'products.product._id': 1,
            'products.product.name': 1,
            'products.product.slug': 1,
            'products.product.price': 1,
            'products.product.description': 1,
            'products.product.image': 1,
            'products.price': 1,
            'products.quantity': 1,
            totalPrice: 1,
            createdAt: 1,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        }
      ]);
      if (!orders) {
        throw new NotFoundException(MESSAGE.ORDER_NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.ORDERS_FETCHED_SUCCESS,
        data: orders,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Get one order.
   * @param orderId The id of the order to get.
   * @returns The order with the specified id.
   */
  async getOrder(user: UserDocument, orderId: string): Promise<BaseResponse> {
    try {
      const order = await this.ordersDocument.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(orderId),
            user: new mongoose.Types.ObjectId(user._id),
          },
        },
        {
          $unwind: { path: '$products', preserveNullAndEmptyArrays: true },
        },
        {
          $addFields: {
            'products.product': {
              $toObjectId: '$products.product',
            },
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'products.product',
          },
        },
        {
          $unwind: '$products.product',
        },
        {
          $group: {
            _id: '$_id',
            products: {
              $push: '$products',
            },
            totalPrice: {
              $first: '$totalPrice',
            },
            createdAt: {
              $first: '$createdAt',
            },
          },
        },
        {
          $project: {
            _id: 1,
            'products.product._id': 1,
            'products.product.name': 1,
            'products.product.slug': 1,
            'products.product.price': 1,
            'products.product.description': 1,
            'products.price': 1,
            'products.quantity': 1,
            totalPrice: 1,
            createdAt: 1,
          },
        },
      ]);
      if (!order) {
        throw new NotFoundException(MESSAGE.ORDER_NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.ORDERS_FETCHED_SUCCESS,
        data: order,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Get all orders for a user.
   * @param userId The id of the user to get orders for.
   * @returns All orders for the specified user.
   */
  async getOrdersByUser(userId: string): Promise<BaseResponse> {
    try {
      const orders = await this.ordersDocument.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $unwind: { path: '$products', preserveNullAndEmptyArrays: true },
        },
        {
          $addFields: {
            'products.product': {
              $toObjectId: '$products.product',
            },
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'products.product',
          },
        },
        {
          $unwind: '$products.product',
        },
        {
          $group: {
            _id: '$_id',
            products: {
              $push: '$products',
            },
            totalPrice: {
              $first: '$totalPrice',
            },
            createdAt: {
              $first: '$createdAt',
            },
          },
        },
        {
          $project: {
            _id: 1,
            'products.product._id': 1,
            'products.product.name': 1,
            'products.product.slug': 1,
            'products.product.price': 1,
            'products.product.description': 1,
            'products.price': 1,
            'products.quantity': 1,
            totalPrice: 1,
            createdAt: 1,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        }
      ]);
      if (!orders) {
        throw new NotFoundException(MESSAGE.ORDER_NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.ORDERS_FETCHED_SUCCESS,
        data: orders,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  /**
   * Update an order.
   * @param orderId The id of the order to update.
   * @param orderStatus The status of the order to update.
   * @returns A promise that resolves to a BaseResponse object.
   */
  async updateOrder(
    orderId: string,
    orderStatus: string,
  ): Promise<BaseResponse> {
    try {
      const [order] = await this.ordersDocument.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(orderId),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
      ]);
      if (!order) {
        throw new NotFoundException(MESSAGE.ORDER_NOT_FOUND);
      }
      if (orderStatus === ORDER_STATUS.CANCELLED) {
        await this.productDocument.findOneAndUpdate(
          { _id: order.products[0].product },
          { $inc: { countInStock: order.products[0].quantity } },
        );
      }
      await this.ordersDocument.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(orderId) },
        {
          $set: {
            status: orderStatus,
          },
        },
      );

      this.notificationsService.emit('notify_user', {
        user: order.user._id,
        userEmail: order.user.email,
        type: 'Order Status Update',
        message: `Your order with id ${orderId} has been ${orderStatus}`,
      });

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.ORDER_UPDATED_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
