import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

/**
 * Represents a module for configuring the database connection using Mongoose.
 */
@Module({
  imports: [
    // Configure MongooseModule with async options
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'), // Get MongoDB URI from ConfigService
      }),
      inject: [ConfigService], // Inject ConfigService dependency
    }),
  ],
})
export class DatabaseModule {
  /**
   * Creates a static method for configuring MongooseModule with models.
   * @param models - An array of model definitions.
   * @returns A MongooseModule configured with the specified models.
   */
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
