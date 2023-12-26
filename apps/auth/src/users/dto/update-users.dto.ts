import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDto } from './create-users.dto';

/**
 * Data transfer object for updating user information.
 * Extends the `CreateUsersDto` class with partial properties.
 */
export class UpdateUsersDto extends PartialType(CreateUsersDto) {}
