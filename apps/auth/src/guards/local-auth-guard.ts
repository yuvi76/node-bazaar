import { AuthGuard } from '@nestjs/passport';

/**
 * LocalAuthGuard class is used as a guard for local authentication.
 * It extends the AuthGuard class and specifies the 'local' strategy.
 */
export class LocalAuthGuard extends AuthGuard('local') {}
