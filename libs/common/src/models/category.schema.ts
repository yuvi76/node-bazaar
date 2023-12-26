import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

/**
 * Represents a document for a category in the database.
 */
@Schema({ versionKey: false, timestamps: true, collection: 'categories' })
export class CategoryDocument extends AbstractDocument {
  /**
   * The name of the category.
   */
  @Prop()
  name: string;

  /**
   * The description of the category.
   */
  @Prop()
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryDocument);
