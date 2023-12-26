import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDocument } from '../models/user.schema';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  return context.switchToHttp().getRequest().user;
};

/**
 * Custom decorator that retrieves the current user from the execution context.
 * @param _data - Optional data passed to the decorator.
 * @param context - The execution context.
 * @returns The current user.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
