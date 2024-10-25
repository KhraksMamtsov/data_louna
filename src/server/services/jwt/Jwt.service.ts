import { Config, Effect, Redacted, Data, Schema, ParseResult } from "effect";

import { IdUser } from "../../../domain/IdUser.domain.ts";
import { AccessToken } from "../../AccessToken.ts";
import { RefreshToken } from "../../RefreshToken.ts";
import * as JWT from "./Jwt.ts";

export class JWTPayload extends Schema.Class<JWTPayload>("JWTPayload")({
  sub: IdUser,
}) {}

const encodeJWT = Schema.encode(JWTPayload);
const decodeJWT = Schema.decodeUnknown(JWTPayload);

export enum JWTServiceErrorType {
  SIGN = "SIGN::JWTServiceErrorType",
  VERIFY = "VERIFY::JWTServiceErrorType",
}

export class JWTServiceSignError extends Data.TaggedError(
  JWTServiceErrorType.SIGN
)<{
  readonly cause: ParseResult.ParseError | JWT.JwtSignError;
}> {}

export class JWTServiceVerifyError extends Data.TaggedError(
  JWTServiceErrorType.VERIFY
)<{
  readonly cause: ParseResult.ParseError | JWT.JwtVerifyError;
}> {}

export class JwtService extends Effect.Service<JwtService>()(
  "@data_louna/server/jwt.service",
  {
    accessors: true,
    effect: Effect.gen(function* () {
      const jwtConfig = yield* Config.all({
        accessTokenSecret: Config.redacted("JWT_ACCESS_TOKEN_SECRET"),
        accessTokenTtl: Config.redacted("JWT_ACCESS_TOKEN_TTL"),
        refreshTokenSecret: Config.redacted("JWT_REFRESH_TOKEN_SECRET"),
        refreshTokenTtl: Config.redacted("JWT_REFRESH_TOKEN_TTL"),
      });

      return {
        sign: (payload: JWTPayload) =>
          encodeJWT(payload).pipe(
            Effect.flatMap((encodedPayload) =>
              Effect.all({
                accessToken: JWT.sign({
                  expiresIn: jwtConfig.accessTokenTtl,
                  key: jwtConfig.accessTokenSecret,
                  payload: encodedPayload,
                }).pipe(Effect.map(AccessToken.fromString)),
                refreshToken: JWT.sign({
                  expiresIn: jwtConfig.refreshTokenTtl,
                  key: jwtConfig.refreshTokenSecret,
                  payload: encodedPayload,
                }).pipe(Effect.map(RefreshToken.fromString)),
              })
            ),
            Effect.orDie,
            Effect.withLogSpan("JwtService.sign"),
            Effect.annotateSpans({ ...payload })
          ),
        verifyAndDecode: (args: {
          readonly token: Redacted.Redacted;
          readonly type: "accessToken" | "refreshToken";
        }) =>
          JWT.verifyAndDecode({
            key: jwtConfig[`${args.type}Secret`],
            token: args.token,
          }).pipe(
            Effect.flatMap(decodeJWT),
            Effect.mapError((cause) => new JWTServiceVerifyError({ cause })),
            Effect.withLogSpan("JwtService.verifyAndDecode"),
            Effect.annotateSpans(args)
          ),
      };
    }),
  }
) {}
