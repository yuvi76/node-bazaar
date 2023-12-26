import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Represents a document for a user in the database.
 */
@Schema({ versionKey: false, timestamps: true, collection: 'users' })
export class UserDocument extends AbstractDocument {
  /**
   * The name of the user.
   */
  @Prop()
  name: string;

  /**
   * The email of the user.
   */
  @Prop()
  email: string;

  /**
   * The password of the user.
   */
  @Prop()
  password: string;

  /**
   * The role of the user.
   */
  @Prop()
  role?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
