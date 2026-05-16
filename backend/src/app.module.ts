import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ApiExceptionFilter } from "./common/http/api-exception.filter";
import { ResponseTransformInterceptor } from "./common/http/response-transform.interceptor";
import { AppLoggerModule } from "./common/logger/logger.module";
import { WarehouseSwaggerService } from "./common/swagger/swagger.service";
import { DatabaseModule } from "./database/database.module";
import { BranchGuard } from "./modules/auth/guards/branch.guard";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { PermissionGuard } from "./modules/auth/guards/permission.guard";
import { AuthModule } from "./modules/auth/module";
import { ItemsModule } from "./modules/items/module";
import { StockModule } from "./modules/stock/module";
import { UserStoresModule } from "./modules/user-stores/module";

@Module({
  imports: [
    AppLoggerModule,
    DatabaseModule,
    AuthModule,
    ItemsModule,
    StockModule,
    UserStoresModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    WarehouseSwaggerService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: BranchGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
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
