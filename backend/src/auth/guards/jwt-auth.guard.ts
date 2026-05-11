import { IS_PUBLIC_KEY } from "@/auth/auth.constants";
import { RequestWithUser } from "@/auth/auth.types";
import { AuthService } from "@/auth/auth.service";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractBearerToken(request);

    request.user = await this.authService.validateBearerToken(token);

    return true;
  }

  private extractBearerToken(request: RequestWithUser) {
    const rawHeader = request.headers.authorization;
    const authorization = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

    if (!authorization) throw new UnauthorizedException("Missing Authorization header");

    const [type, token] = authorization.split(" ");
    if (type !== "Bearer" || !token)
      throw new UnauthorizedException("Invalid Authorization header");

    return token;
  }
}
