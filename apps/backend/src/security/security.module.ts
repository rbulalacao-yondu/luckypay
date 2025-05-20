import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cors from 'cors';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';

@Module({})
export class SecurityModule implements NestModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // Apply Helmet security headers
    consumer.apply(helmet).forRoutes('*');

    // Apply CORS
    consumer
      .apply(
        cors({
          origin:
            this.configService.get('CORS_ORIGIN') || 'http://localhost:3000',
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
          allowedHeaders: ['Content-Type', 'Authorization'],
        }),
      )
      .forRoutes('*');

    // Apply rate limiting
    consumer
      .apply(
        rateLimit({
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100, // Limit each IP to 100 requests per windowMs
          message: 'Too many requests from this IP, please try again later.',
          standardHeaders: true,
          legacyHeaders: false,
        }),
      )
      .forRoutes('*');

    // Apply cookie parser
    consumer.apply(cookieParser()).forRoutes('*');

    // Apply session middleware
    consumer
      .apply(
        session({
          secret: this.configService.get('SESSION_SECRET') || 'your-secret-key',
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
          },
        }),
      )
      .forRoutes('*');
  }
}
