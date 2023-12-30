import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Represents an address in the database.
 */
class Address {
  /**
   * The street of the address.
   */
  @Prop()
  street: string;

  /**
   * The city of the address.
   */
  @Prop()
  city: string;

  /**
   * The state of the address.
   */
  @Prop()
  state: string;

  /**
   * The zip code of the address.
   */
  @Prop()
  zip: string;

  /**
   * The country of the address.
   */
  @Prop()
  country: string;

  /**
   * The isDefault of the address.
   */
  @Prop()
  isDefault: boolean;
}

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

  /**
   * The addresses of the user.
   */
  @Prop()
  address?: Address[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
