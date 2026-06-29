import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'AUTH_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3001 } },
      { name: 'USER_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3002 } },
      { name: 'BOOK_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3003 } },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
