import {
  HttpApiMiddleware,
  HttpApiSchema,
  HttpApiSecurity,
  OpenApi,
} from "@effect/platform";
import { Context, Schema } from "effect";
import { JWTPayload } from "../server/services/jwt/Jwt.service.ts";
import { User } from "../domain/User.domain.ts";

export class UnauthorizedError extends Schema.TaggedError<UnauthorizedError>()(
  "UnauthorizedError",
  {},
  HttpApiSchema.annotations({ status: 401 })
) {}

export class AuthorizedSession extends Context.Tag("AuthorizedSession")<
  AuthorizedSession,
  {
    readonly jwtPayload: JWTPayload;
    readonly currentUser: User;
  }
>() {}

export class Authorization extends HttpApiMiddleware.Tag<Authorization>()(
  "Authorization",
  {
    failure: UnauthorizedError,
    provides: AuthorizedSession,
    security: {
      authBearer: HttpApiSecurity.bearer.pipe(
        HttpApiSecurity.annotate(OpenApi.Format, "jwt")
      ),
    },
  }
) {}
