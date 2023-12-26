import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../constants';
import { UserDto } from '../dto/user.dto';

/**
 * Guard that checks if a request has a valid JWT token.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Determines if the request can be activated.
   * @param context - The execution context.
   * @returns A boolean indicating if the request can be activated.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get the JWT token from the request headers
    const headers = context.switchToHttp().getRequest().headers;
    const authorizationHeader =
      headers?.authorization || headers?.Authorization;

    // If 'Authorization' header is not present, return false
    if (!authorizationHeader) {
      return false;
    }

    // Get the JWT token from the 'Authorization' header
    const jwt = authorizationHeader.split(' ')[1];

    // If JWT token is not present, return false
    if (!jwt) {
      return false;
    }

    // Get the roles from the metadata
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // Send a request to the authentication service to validate the JWT token
    return this.authClient
      .send<UserDto>('authenticate', { Authentication: jwt })
      .pipe(
        // Set the authenticated user in the request object
        tap((res) => {
          if (roles && !roles.includes(res.role)) {
            throw new UnauthorizedException();
          }
          context.switchToHttp().getRequest().user = res;
        }),
        // Return true to allow the request to be activated
        map(() => true),
        catchError(() => {
          return of(false);
        }),
      );
  }
}
