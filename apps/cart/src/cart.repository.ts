import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, CartDocument } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/**
 * Repository class for managing category data.
 */
@Injectable()
export class CartRepository extends AbstractRepository<CartDocument> {
  /**
   * Logger instance for logging repository operations.
   */
  protected readonly logger = new Logger(CartRepository.name);

  /**
   * Creates an instance of CartRepository.
   * @param cartModel The injected Mongoose model for CartDocument.
   */
  constructor(@InjectModel(CartDocument.name) cartModel: Model<CartDocument>) {
    super(cartModel);
  }
}
