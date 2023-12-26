import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard class is a custom authentication guard that extends the AuthGuard class provided by the 'jwt' strategy.
 * It is used to protect routes and endpoints that require JWT authentication.
 */
export class JwtAuthGuard extends AuthGuard('jwt') {}
