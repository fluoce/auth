import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './func/prisma-exception-filter';
import { ResponseInterceptor } from './response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      try {
        const url = new URL(origin);
        if (url.hostname === 'localhost') {
          return callback(null, true);
        }
        if (url.hostname.endsWith('.fluoce.com') || url.hostname === 'fluoce.com') {
          return callback(null, true);
        }
      } catch (e) {
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');

  console.log('LISTENING ON', port);
}
bootstrap();
