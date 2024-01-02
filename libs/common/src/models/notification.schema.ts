import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import * as mongoose from 'mongoose';

/**
 * Represents a document for a Notifications in the database.
 */
@Schema({ versionKey: false, timestamps: true, collection: 'notifications' })
export class NotificationsDocument extends AbstractDocument {
  /**
   * The user of the Notifications.
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: string;

  /**
   * The type of the Notifications.
   */
  @Prop()
  type: string;

  /**
   * The message of the Notifications.
   */
  @Prop()
  message: string;

  /**
   * The isRead of the Notifications.
   */
  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationsSchema = SchemaFactory.createForClass(
  NotificationsDocument,
);
