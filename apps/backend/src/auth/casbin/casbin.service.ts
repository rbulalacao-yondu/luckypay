import { Injectable } from '@nestjs/common';
import { Enforcer } from 'casbin';

@Injectable()
export class CasbinService {
  constructor(private enforcer: Enforcer) {}

  async getEnforcer(): Promise<Enforcer> {
    return this.enforcer;
  }

  async checkPermission(
    sub: string,
    obj: string,
    act: string,
  ): Promise<boolean> {
    return this.enforcer.enforce(sub, obj, act);
  }

  async addPolicy(sub: string, obj: string, act: string): Promise<boolean> {
    return this.enforcer.addPolicy(sub, obj, act);
  }

  async removePolicy(sub: string, obj: string, act: string): Promise<boolean> {
    return this.enforcer.removePolicy(sub, obj, act);
  }

  async addRoleForUser(user: string, role: string): Promise<boolean> {
    return this.enforcer.addRoleForUser(user, role);
  }

  async removeRoleForUser(user: string, role: string): Promise<boolean> {
    return this.enforcer.deleteRoleForUser(user, role);
  }

  async getAllRoles(): Promise<string[]> {
    return this.enforcer.getAllRoles();
  }

  async getUserRoles(username: string): Promise<string[]> {
    return this.enforcer.getRolesForUser(username);
  }

  async hasRole(username: string, role: string): Promise<boolean> {
    const roles = await this.enforcer.getRolesForUser(username);
    return roles.includes(role);
  }
}
