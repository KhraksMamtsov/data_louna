import { Effect, Redacted, Data } from "effect";
import JWT from "jsonwebtoken";

export enum JwtErrorType {
  SIGN = "SIGN::JwtErrorType",
  VERIFY = "VERIFY::JwtErrorType",
}

export class JwtSignError extends Data.TaggedError(JwtErrorType.SIGN)<{
  readonly cause: Error;
}> {}
export class JwtVerifyError extends Data.TaggedError(JwtErrorType.VERIFY)<{
  readonly cause: JWT.VerifyErrors;
}> {}

export const sign = (args: {
  readonly expiresIn: Redacted.Redacted;
  readonly key: Redacted.Redacted;
  readonly payload: Record<string, string | number | boolean>;
}) =>
  Effect.async<string, JwtSignError>((cont) => {
    JWT.sign(
      args.payload,
      Redacted.value(args.key),
      { algorithm: "HS256", expiresIn: Redacted.value(args.expiresIn) },
      (cause, jwt) => {
        cause !== null
          ? cont(Effect.fail(new JwtSignError({ cause })))
          : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            cont(Effect.succeed(jwt!));
      }
    );
  });

export const verifyAndDecode = (args: {
  readonly key: Redacted.Redacted;
  readonly token: Redacted.Redacted;
}) =>
  Effect.async<JWT.JwtPayload, JwtVerifyError>((cont) => {
    JWT.verify(
      Redacted.value(args.token),
      Redacted.value(args.key),
      {
        algorithms: ["HS256"],
        complete: false,
      },
      (cause, jwt) => {
        cause !== null
          ? cont(Effect.fail(new JwtVerifyError({ cause })))
          : cont(Effect.succeed(jwt as JWT.JwtPayload));
      }
    );
  });
