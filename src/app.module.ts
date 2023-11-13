import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerHttpMiddleware } from './middleware/logger-http.middleware';
import { DbModule } from './db/db.module';
import { BookModule } from './api/book/book.module';
import { UserModule } from './api/user/user.module';
import { CartModule } from './api/cart/cart.module';
import { OrderModule } from './api/order/order.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    BookModule,
    DbModule,
    UserModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerHttpMiddleware).forRoutes('*');
  }
}
