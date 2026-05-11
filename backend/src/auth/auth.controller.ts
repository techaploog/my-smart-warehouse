import { parseZod } from "@/common/zod/zod.util";
import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { z } from "zod";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";

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
          properties: {
            accessToken: { type: "string" },
            tokenType: { type: "string", example: "Bearer" },
            expiresIn: { type: "number", example: 86400 },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Invalid email or password" })
  login(@Body() body: unknown) {
    const values = parseZod(
      z.object({
        email: z
          .string()
          .email()
          .transform((email) => email.toLowerCase()),
        password: z.string().min(1),
      }),
      body,
    );

    return this.authService.login(values.email, values.password);
  }
}
