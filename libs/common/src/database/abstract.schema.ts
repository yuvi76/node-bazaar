import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

/**
 * Represents an abstract document in the database.
 */
@Schema({ timestamps: true })
export class AbstractDocument {
  /**
   * The unique identifier of the document.
   */
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
}
