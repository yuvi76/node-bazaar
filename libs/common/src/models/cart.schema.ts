import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "@app/common";
import * as mongoose from "mongoose";

/**
 * Represents a product in the cart.
 */
class Product {
  /**
   * The product ID associated with the cart.
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "products" })
  product: mongoose.ObjectId;

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

  /**
   * The total price of the product in the cart.
   */
  @Prop({ default: 0 })
  totalPrice: number;
}

/**
 * Represents a document for a cart in the nodebazaar system.
 */
@Schema({ versionKey: false, timestamps: true, collection: "carts" })
export class CartDocument extends AbstractDocument {
  /**
   * The user associated with the cart.
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "users" })
  user: string;

  /**
   * The products in the cart.
   */
  @Prop([Product])
  products: Product[];

  /**
   * The status of the cart.
   */
  @Prop({ default: true })
  status: boolean;

  /**
   * The total price of the cart.
   */
  @Prop({ default: 0 })
  totalCartPrice: number;

  /**
   * The total quantity of the cart.
   */
  @Prop({ default: 0 })
  totalQuantity: number;

  /**
   * The total number of products in the cart.
   */
  @Prop({ default: 0 })
  totalProducts: number;
}

export const CartSchema = SchemaFactory.createForClass(CartDocument);
