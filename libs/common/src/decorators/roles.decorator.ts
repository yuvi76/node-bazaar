import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../constants';

/**
 * Decorator function that sets the metadata for the allowed roles.
 * @param roles The roles allowed for the decorated element.
 * @returns A metadata decorator function.
 */
export const Roles = (...roles: ROLE[]) => SetMetadata('roles', roles);
