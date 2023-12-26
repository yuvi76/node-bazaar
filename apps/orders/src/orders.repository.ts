import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, OrdersDocument } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/**
 * Repository class for managing order data.
 */
@Injectable()
export class OrdersRepository extends AbstractRepository<OrdersDocument> {
  /**
   * Logger instance for logging repository operations.
   */
  protected readonly logger = new Logger(OrdersRepository.name);

  /**
   * Creates an instance of OrdersRepository.
   * @param orderModel The injected Mongoose model for OrdersDocument.
   */
  constructor(
    @InjectModel(OrdersDocument.name) orderModel: Model<OrdersDocument>,
  ) {
    super(orderModel);
  }
}
