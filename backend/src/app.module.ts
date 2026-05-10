import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ApiExceptionFilter } from "./common/http/api-exception.filter";
import { ResponseTransformInterceptor } from "./common/http/response-transform.interceptor";
import { DatabaseModule } from "./database/database.module";
import { ItemsModule } from "./items/items.module";
import { StockModule } from "./stock/stock.module";

@Module({
  imports: [DatabaseModule, ItemsModule, StockModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
})
export class AppModule {}
