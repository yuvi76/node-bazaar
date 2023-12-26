import { Module } from '@nestjs/common';
import {
  DatabaseModule,
  ErrorHandlerService,
  UserDocument,
  UserSchema,
} from '@app/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

/**
 * Module for managing users.
 */
@Module({
  /**
   * Import the DatabaseModule to establish a connection to the database.
   * Also, use the DatabaseModule's `forFeature` method to specify the UserDocument and UserSchema to be used.
   */
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  /**
   * Specify the UsersController as the controller for handling user-related requests.
   */
  controllers: [UsersController],
  /**
   * Provide the UsersService, ErrorHandlerService and UsersRepository as providers for dependency injection.
   */
  providers: [UsersService, UsersRepository, ErrorHandlerService],
  /**
   * Export the UsersService to make it available for other modules to use.
   */
  exports: [UsersService],
})
export class UsersModule {}
