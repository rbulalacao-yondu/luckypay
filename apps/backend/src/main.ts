import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Get config service
  const configService = app.get(ConfigService);

  // Use Winston logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Enable compression
  app.use(compression());

  // Enable all configured security middleware
  const helmetConfig = configService.get('security.helmet');
  app.use(helmet(helmetConfig));

  // CORS configuration
  const corsConfig = configService.get('security.cors');
  app.enableCors(corsConfig);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  app
    .get(WINSTON_MODULE_NEST_PROVIDER)
    .log(`Application is running on: ${await app.getUrl()}`, 'NestApplication');
}
bootstrap();
