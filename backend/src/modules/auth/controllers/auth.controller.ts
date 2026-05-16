import { zodPipe } from "@/common/zod/zod.util";
import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { loginRequestSchema, type LoginRequestDto } from "@warehouse/shared";
import { AuthService } from "../services/auth.service";
import { Public } from "../decorators/public.decorator";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Login and receive a bearer access token" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email", example: "admin@example.com" },
        password: { type: "string", example: "admin123" },
      },
    },
  })
  @ApiOkResponse({
    description: "Bearer token and authenticated user",
    schema: {
      type: "object",
      required: ["success", "data"],
      properties: {
        success: { type: "boolean", example: true },
        data: {
          type: "object",
          required: ["accessToken", "tokenType", "expiresIn", "user"],
          properties: {
            accessToken: { type: "string" },
            tokenType: { type: "string", example: "Bearer" },
            expiresIn: { type: "number", example: 86400 },
            user: {
              type: "object",
              required: ["id", "email", "name", "permissions", "branchs", "storeCodes"],
              properties: {
                id: { type: "string", format: "uuid" },
                email: { type: "string", format: "email", example: "admin@example.com" },
                name: { type: "string", example: "System Admin" },
                permissions: {
                  type: "array",
                  items: { type: "string" },
                  example: ["item-brands:read", "item-brands:create"],
                },
                branchs: {
                  type: "array",
                  items: { type: "string" },
                  example: ["ST01"],
                },
                storeCodes: {
                  type: "array",
                  items: { type: "string" },
                  example: ["ST01"],
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Invalid email or password" })
  login(@Body(zodPipe(loginRequestSchema)) body: LoginRequestDto) {
    return this.authService.login(body.email, body.password);
  }
}
