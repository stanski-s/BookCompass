import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BookServiceController } from './book-service.controller';
import { BookServiceService } from './book-service.service';
import { Book } from './book.entity';
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
        url: configService.get<string>('BOOK_DB_URL'),
        entities: [Book, Review],
        synchronize: true, // na produkcję do zmiany na false
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Book, Review]),
    ClientsModule.registerAsync([
      {
        name: 'RMQ_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') as string],
            queue: 'ai_queue', // example queue, the actual AI service will listen to this
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [BookServiceController],
  providers: [BookServiceService],
})
export class BookServiceModule {}
