import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../users/entities/user.entity';
import {
  JwtPayload,
  TokenResponse,
  RefreshTokenData,
  AccessTokenData,
} from '../interfaces/jwt.interface';

@Injectable()
export class TokenService {
  private readonly activeTokens: Map<string, AccessTokenData> = new Map();
  private readonly refreshTokens: Map<string, RefreshTokenData> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(user: User): Promise<TokenResponse> {
    const tokenId = uuidv4();
    const accessTokenPayload: JwtPayload = {
      sub: user.id,
      mobileNumber: user.mobileNumber,
      email: user.email,
      role: user.role,
      type: 'access',
      jti: tokenId,
    };

    const refreshTokenPayload: JwtPayload = {
      ...accessTokenPayload,
      type: 'refresh',
      jti: uuidv4(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.accessTokenExpiry'),
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.refreshTokenExpiry'),
      }),
    ]);

    // Store token metadata
    const accessTokenExp = this.getExpirationFromToken(accessToken);
    const refreshTokenExp = this.getExpirationFromToken(refreshToken);

    this.activeTokens.set(tokenId, {
      userId: user.id,
      tokenId,
      expiresAt: accessTokenExp,
    });

    this.refreshTokens.set(refreshTokenPayload.jti, {
      userId: user.id,
      refreshToken,
      expiresAt: refreshTokenExp,
      isRevoked: false,
    });

    // Clean up expired tokens periodically
    this.cleanupExpiredTokens();

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExp.getTime(),
    };
  }

  async validateAccessToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      if (payload.type !== 'access' || !this.activeTokens.has(payload.jti)) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<TokenResponse | null> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>('jwt.secret'),
        },
      );

      if (payload.type !== 'refresh') {
        return null;
      }

      const storedToken = this.refreshTokens.get(payload.jti);
      if (
        !storedToken ||
        storedToken.isRevoked ||
        storedToken.expiresAt < new Date()
      ) {
        return null;
      }

      // Generate new access token
      const tokenId = uuidv4();
      const newAccessPayload: JwtPayload = {
        sub: payload.sub,
        mobileNumber: payload.mobileNumber,
        email: payload.email,
        role: payload.role,
        type: 'access',
        jti: tokenId,
      };

      const accessToken = await this.jwtService.signAsync(newAccessPayload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.accessTokenExpiry'),
      });

      const expiresAt = this.getExpirationFromToken(accessToken);
      this.activeTokens.set(tokenId, {
        userId: payload.sub,
        tokenId,
        expiresAt,
      });

      return {
        accessToken,
        refreshToken,
        expiresIn: expiresAt.getTime(),
      };
    } catch {
      return null;
    }
  }

  async revokeAllUserTokens(userId: number): Promise<void> {
    // Revoke active access tokens
    for (const [tokenId, token] of this.activeTokens.entries()) {
      if (token.userId === userId) {
        this.activeTokens.delete(tokenId);
      }
    }

    // Revoke refresh tokens
    for (const [tokenId, token] of this.refreshTokens.entries()) {
      if (token.userId === userId) {
        token.isRevoked = true;
      }
    }
  }

  isTokenActive(jti: string): boolean {
    const token = this.activeTokens.get(jti);
    return token !== undefined && token.expiresAt > new Date();
  }

  private getExpirationFromToken(token: string): Date {
    const decoded = this.jwtService.decode(token) as JwtPayload;
    if (!decoded || typeof decoded.exp === 'undefined') {
      throw new Error('Invalid token: expiration time is missing');
    }
    return new Date(decoded.exp * 1000);
  }

  private cleanupExpiredTokens(): void {
    const now = new Date();

    // Clean up expired access tokens
    for (const [tokenId, token] of this.activeTokens.entries()) {
      if (token.expiresAt < now) {
        this.activeTokens.delete(tokenId);
      }
    }

    // Clean up expired refresh tokens
    for (const [tokenId, token] of this.refreshTokens.entries()) {
      if (token.expiresAt < now) {
        this.refreshTokens.delete(tokenId);
      }
    }
  }
}
