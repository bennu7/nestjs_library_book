import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestMethod } from '@nestjs/common';

import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { Book } from './entities/book.entity';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/api/book', method: RequestMethod.GET },
        { path: '/api/book', method: RequestMethod.POST },
      );
  }
}
