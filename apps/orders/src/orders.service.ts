import {
  Injectable,
  HttpStatus,
  NotFoundException,
  Inject,
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
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  /**
   * Place a new order.
   * @param createOrderDto The data for creating the order.
   * @returns The created order.
   */
  async placeOrder(user: UserDocument): Promise<any> {
    try {
      const cart = await this.cartDocument.findOne({ user: user._id });
      if (!cart) {
        throw new NotFoundException(MESSAGE.CART_NOT_FOUND);
      }
      return this.paymentsService
        .send('create_checkout_session', cart._id)
        .pipe(
          map(async (res) => {
            await this.cartDocument.deleteMany({ user: user._id });
            const [address] = user.address.filter((address) => address.isDefault);
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
   * @returns A promise that resolves to a BaseResponse object.
   */
  async updateOrder(orderId: string): Promise<BaseResponse> {
    try {
      const order = await this.ordersDocument.findById(orderId);
      if (!order) {
        throw new NotFoundException(MESSAGE.ORDER_NOT_FOUND);
      }
      order.status = ORDER_STATUS.COMPLETED;
      await order.save();
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGE.ORDER_UPDATED_SUCCESS,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
