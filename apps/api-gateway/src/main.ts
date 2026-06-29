import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  await app.listen(8080);
  console.log(`API Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
