import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    credentials: true,
  });

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
}
bootstrap();
