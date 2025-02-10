import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  // SWAGGER
  const config = new DocumentBuilder()
  .setTitle('Respect API')
  .setDescription('API для управления студентами по МДК')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);

  // РОУТ ДОКУМЕНТАЦИИ
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
  console.log(`[API] http://localhost:${port}/api`)
  console.log(`[API] Documentation: http://localhost:${port}/api-docs`)
}
bootstrap();
