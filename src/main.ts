import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import './tracing';

async function bootstrap() {
  // 1. Adicionamos o { bufferLogs: true }
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // 2. Substituímos o logger padrão pelo Pino
  app.useLogger(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Inmeta - Desafio Técnico')
    .setDescription('API desenvolvida com NestJS, MongoDB e Arquitetura Hexagonal')
    .setVersion('1.0')
    .addTag('Employees')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('🚀 Aplicação rodando em: http://localhost:3000');
  console.log('📚 Documentação Swagger: http://localhost:3000/api/docs');
  console.log('🔍 Jaeger Tracing UI: http://localhost:16686');
}
bootstrap();
