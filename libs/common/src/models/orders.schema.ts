import { AbstractDocument, ORDER_STATUS } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

/**
 * Represents a product in the cart.
 */
class Product {
  /**
   * The product ID associated with the cart.
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'products' })
  product: string;

  /**
   * The quantity of the product in the cart.
   */
  @Prop({ default: 0 })
  quantity: number;

  /**
   * The price of the product in the cart.
   */
  @Prop({ default: 0 })
  price: number;
}

/**
 * Represents a document for an order in the database.
 */
@Schema({ versionKey: false, timestamps: true, collection: 'orders' })
export class OrdersDocument extends AbstractDocument {
  /**
   * The user ID of the order.
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: string;

  /**
   * The products of the order.
   */
  @Prop([Product])
  products: Product[];

  /**
   * The total price of the order.
   */
  @Prop({ default: 0 })
  totalPrice: number;

  /**
   * The status of the order.
   */
  @Prop({ type: String, enum: ORDER_STATUS, default: ORDER_STATUS.PENDING })
  status: string;

  /**
   * The checkout session ID of the order.
   */
  @Prop({ type: String })
  checkoutSessionId: string;

  /**
   * The checkout url of the order.
   */
  @Prop({ type: String })
  checkoutUrl: string;

  /**
   * The Delivery Address of the order.
   */
  @Prop({ type: Object })
  deliveryAddress: object;
}

export const OrdersSchema = SchemaFactory.createForClass(OrdersDocument);
