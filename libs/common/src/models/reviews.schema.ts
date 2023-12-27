import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

/**
 * Represents a document for an reviews in the database.
 */
@Schema({ versionKey: false, timestamps: true, collection: 'reviews' })
export class ReviewsDocument extends AbstractDocument {
  /**
   * The user ID of the reviews.
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: string;

  /**
   * The product ID of the reviews.
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'products' })
  product: string;

  /**
   * The rating of the reviews.
   */
  @Prop({ default: 0 })
  rating: number;

  /**
   * The review of the reviews.
   */
  @Prop({ type: String })
  review: string;
}

export const ReviewsSchema = SchemaFactory.createForClass(ReviewsDocument);
