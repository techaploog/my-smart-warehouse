import { Global, Module } from "@nestjs/common";
import db, { TDatabase } from "../db";
import { DB } from "./database.constants";

@Global()
@Module({
  providers: [
    {
      provide: DB,
      useValue: db satisfies TDatabase,
    },
  ],
  exports: [DB],
})
export class DatabaseModule {}
