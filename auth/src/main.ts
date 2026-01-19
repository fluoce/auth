import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './func/prisma-exception-filter';
import { ResponseInterceptor } from './response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["http://localhost:5173", "http://localhost:3000", "https://auth.fluoce.com"],
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
