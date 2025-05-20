import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CasbinService } from './casbin.service';

@Injectable()
export class CasbinGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly casbinService: CasbinService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    const resource = this.reflector.get<string>(
      'resource',
      context.getHandler(),
    );
    const action = this.reflector.get<string>('action', context.getHandler());

    if (!resource || !action) {
      return true;
    }

    return this.checkPermission(user.role, resource, action);
  }

  private async checkPermission(
    role: string,
    resource: string,
    action: string,
  ): Promise<boolean> {
    try {
      const hasPermission = await this.casbinService.checkPermission(
        role,
        resource,
        action,
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          `${role} is not allowed to ${action} ${resource}`,
        );
      }

      return true;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
