import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, UserDocument } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/**
 * Repository class for managing user data.
 */
@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  /**
   * Logger instance for logging repository operations.
   */
  protected readonly logger = new Logger(UsersRepository.name);

  /**
   * Creates an instance of UsersRepository.
   * @param userModel The injected Mongoose model for UserDocument.
   */
  constructor(@InjectModel(UserDocument.name) userModel: Model<UserDocument>) {
    super(userModel);
  }
}
