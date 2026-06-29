import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // Set global prefix if needed
  // app.setGlobalPrefix('api');

  await app.listen(3000);
  console.log(`API Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
