import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReviewServiceController } from './review-service.controller';
import { ReviewServiceService } from './review-service.service';
import { Review } from './review.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('REVIEW_DB_URL'),
        entities: [Review],
        synchronize: true, // DEV ONLY
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Review]),
    ClientsModule.registerAsync([
      {
        name: 'RMQ_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') as string],
            queue: 'ai_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReviewServiceController],
  providers: [ReviewServiceService],
})
export class ReviewServiceModule {}
