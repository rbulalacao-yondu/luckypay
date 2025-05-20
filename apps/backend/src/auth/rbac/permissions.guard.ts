import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolePermissions } from './permissions.constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const hasPermission = this.matchPermissions(permissions, user.role);

    if (!hasPermission) {
      throw new ForbiddenException('You do not have the required permissions');
    }

    return true;
  }

  private matchPermissions(
    requiredPermissions: string[],
    userRole: string,
  ): boolean {
    const userPermissions = RolePermissions[userRole] || [];
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
