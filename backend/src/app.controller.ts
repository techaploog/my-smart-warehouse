import { Public } from "@/modules/auth/decorators/public.decorator";
import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Hello message (wrapped by global interceptor)" })
  @ApiOkResponse({
    description: "Standard success envelope",
    schema: {
      type: "object",
      required: ["success", "data"],
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          properties: { value: { type: "string", example: "NestJS - Hello World!" } },
        },
      },
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
