export const Permissions = {
  // User permissions
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Transaction permissions
  TRANSACTION_CREATE: 'transaction:create',
  TRANSACTION_READ: 'transaction:read',
  TRANSACTION_UPDATE: 'transaction:update',
  TRANSACTION_DELETE: 'transaction:delete',

  // Machine permissions
  MACHINE_CREATE: 'machine:create',
  MACHINE_READ: 'machine:read',
  MACHINE_UPDATE: 'machine:update',
  MACHINE_DELETE: 'machine:delete',

  // Loyalty permissions
  LOYALTY_CREATE: 'loyalty:create',
  LOYALTY_READ: 'loyalty:read',
  LOYALTY_UPDATE: 'loyalty:update',
  LOYALTY_DELETE: 'loyalty:delete',

  // Report permissions
  REPORT_CREATE: 'report:create',
  REPORT_READ: 'report:read',
  REPORT_UPDATE: 'report:update',
  REPORT_DELETE: 'report:delete',
} as const;

export const RolePermissions = {
  super_admin: [
    Permissions.USER_CREATE,
    Permissions.USER_READ,
    Permissions.USER_UPDATE,
    Permissions.USER_DELETE,
    Permissions.TRANSACTION_CREATE,
    Permissions.TRANSACTION_READ,
    Permissions.TRANSACTION_UPDATE,
    Permissions.TRANSACTION_DELETE,
    Permissions.MACHINE_CREATE,
    Permissions.MACHINE_READ,
    Permissions.MACHINE_UPDATE,
    Permissions.MACHINE_DELETE,
    Permissions.LOYALTY_CREATE,
    Permissions.LOYALTY_READ,
    Permissions.LOYALTY_UPDATE,
    Permissions.LOYALTY_DELETE,
    Permissions.REPORT_CREATE,
    Permissions.REPORT_READ,
    Permissions.REPORT_UPDATE,
    Permissions.REPORT_DELETE,
  ],
  finance_admin: [
    Permissions.TRANSACTION_CREATE,
    Permissions.TRANSACTION_READ,
    Permissions.TRANSACTION_UPDATE,
    Permissions.REPORT_READ,
    Permissions.USER_READ,
  ],
  loyalty_manager: [
    Permissions.LOYALTY_CREATE,
    Permissions.LOYALTY_READ,
    Permissions.LOYALTY_UPDATE,
    Permissions.USER_READ,
    Permissions.REPORT_READ,
  ],
  user: [Permissions.TRANSACTION_READ, Permissions.LOYALTY_READ],
} as const;
