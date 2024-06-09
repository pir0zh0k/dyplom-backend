import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Intensa-Chat')
    .setDescription('Chat API for Intensa-Chat-App')
    .setVersion('1.0')
    .addTag('Intensa-Chat')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api/v1/');

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
