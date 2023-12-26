import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AbstractDocument } from '@app/common';

/**
 * Represents a document for a product in the database.
 */
@Schema({ versionKey: false, timestamps: true, collection: 'products' })
export class ProductDocument extends AbstractDocument {
  /**
   * The name of the product.
   */
  @Prop()
  name: string;

  /**
   * The slug of the product.
   */
  @Prop()
  slug: string;

  /**
   * The description of the product.
   */
  @Prop()
  description: string;

  /**
   * The price of the product.
   */
  @Prop({ default: 0 })
  price: number;

  /**
   * The count of the product in stock.
   */
  @Prop({ default: 0 })
  countInStock: number;

  /**
   * The status of the product.
   */
  @Prop({ default: true })
  status: boolean;

  /**
   * The rating of the product.
   */
  @Prop({ default: 0 })
  rating: number;

  /**
   * The number of reviews of the product.
   */
  @Prop({ default: 0 })
  numberOfReviews: number;

  /**
   * The brand of the product.
   */
  @Prop()
  brand: string;

  /**
   * The category of the product.
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  category: string;

  /**
   * The image of the product.
   */
  @Prop()
  image: string[];

  /**
   * The size of the product.
   */
  @Prop()
  size: string[];

  /**
   * The color of the product.
   */
  @Prop()
  color: string[];

  /**
   * The tags of the product.
   */
  @Prop()
  tags: string[];

  /**
   * The today deals status of the product.
   */
  @Prop({ default: false })
  todayDeals: boolean;

  /**
   * The featured status of the product.
   */
  @Prop({ default: false })
  featured: boolean;

  /**
   * The seller featured status of the product.
   */
  @Prop({ default: false })
  sellerFeatured: boolean;

  /**
   * The cash on delivery status of the product.
   */
  @Prop({ default: false })
  cashOnDelivery: boolean;

  /**
   * The free shipping status of the product.
   */
  @Prop({ default: false })
  freeShipping: boolean;

  /**
   * The min quantity of the product.
   */
  @Prop({ default: 1 })
  minQuantity: number;

  /**
   * The discount of the product.
   */
  @Prop({ default: 0 })
  discount: number;

  /**
   * The discount type of the product.
   */
  @Prop()
  discountType: string;

  /**
   * The tax of the product.
   */
  @Prop({ default: 0 })
  tax: number;

  /**
   * The tax type of the product.
   */
  @Prop()
  taxType: string;

  /**
   * The shipping cost of the product.
   */
  @Prop({ default: 0 })
  shippingCost: number;
}

export const ProductSchema = SchemaFactory.createForClass(ProductDocument);
