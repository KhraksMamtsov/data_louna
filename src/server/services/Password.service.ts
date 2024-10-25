import { Config, Effect, Redacted } from "effect";

import crypto from "node:crypto";

export class PasswordService extends Effect.Service<PasswordService>()(
  "PasswordService",
  {
    accessors: true,
    effect: Effect.gen(function* () {
      const salt = yield* Config.redacted("PASSWORD_SALT");

      const _hash = (password: Redacted.Redacted) =>
        Effect.try(() => {
          const hash = crypto.createHmac("sha256", Redacted.value(salt));
          hash.update(Redacted.value(password));
          return hash.digest("hex");
        }).pipe(Effect.orDie);
      return {
        hash: _hash,
        compare: (password: Redacted.Redacted, hash: string) =>
          _hash(password).pipe(Effect.map((x) => x === hash)),
      };
    }),
  }
) {}
