import { UserRole } from '../../users/entities/user.entity';

export interface JwtPayload {
  sub: number;
  mobileNumber?: string;
  email?: string;
  role: UserRole;
  type: 'access' | 'refresh';
  jti: string; // JWT ID for token tracking
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenData {
  userId: number;
  refreshToken: string;
  expiresAt: Date;
  isRevoked: boolean;
}

export interface AccessTokenData {
  userId: number;
  tokenId: string; // jti
  expiresAt: Date;
}
