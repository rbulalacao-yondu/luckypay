import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '@luckypay/shared-types';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const request = context.switchToHttp().getRequest();
    const path = request.route?.path || 'unknown path';

    // User object should exist at this point due to JwtAuthGuard
    if (!user) {
      this.logger.warn(`No user object found in request for ${path}`);
      return false;
    }

    // Log role information for debugging
    this.logger.log(
      `Checking access for path: ${path}, user role: ${user.role}, required roles: ${requiredRoles.join(', ')}`,
    );

    // Check if user role matches any of the required roles
    // We do a loose comparison to handle various role formats
    const userRoleStr = String(user.role).toLowerCase();
    const hasPermission = requiredRoles.some(
      (role) => String(role).toLowerCase() === userRoleStr,
    );

    if (!hasPermission) {
      this.logger.warn(
        `Access denied: User with role ${user.role} attempted to access ${path} which requires roles: ${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException(
        'Insufficient permissions to access this resource',
      );
    }

    return true;
  }
}
