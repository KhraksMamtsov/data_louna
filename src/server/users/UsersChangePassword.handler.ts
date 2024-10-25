import { PgDrizzle } from "@effect/sql-drizzle/Pg";
import { eq } from "drizzle-orm";
import { Effect, Redacted } from "effect";
import { AuthorizedSession } from "../../api_spec/Authorization.security.ts";
import {
  WeakPasswordError,
  WrongPasswordError,
  UserChangePasswordResponse,
} from "../../api_spec/users/Users.change_password.endpoint.ts";
import { UsersTable } from "../../dal/schema.ts";
import { PasswordService } from "../services/Password.service.ts";
import { HttpApiBuilder } from "@effect/platform";
import { DataLounaApi } from "../../api_spec/Api.ts";

export const UsersChangePasswordHandler = HttpApiBuilder.handler(
  DataLounaApi,
  "users",
  "changePassword",
  ({ payload }) =>
    Effect.gen(function* () {
      const newPassword = Redacted.value(payload.newPassword);
      const PASSWORD_LENGTH = 3;

      if (newPassword.length < PASSWORD_LENGTH) {
        yield* new WeakPasswordError({
          message: `New password is too short. Required length is ${PASSWORD_LENGTH}`,
        });
      }

      const { currentUser, jwtPayload } = yield* AuthorizedSession;

      const isCurrentPasswordCorrect = yield* PasswordService.compare(
        payload.password,
        Redacted.value(currentUser.password)
      ).pipe(Effect.orDie);

      if (!isCurrentPasswordCorrect) {
        return yield* new WrongPasswordError();
      }

      const newPasswordHash = yield* PasswordService.hash(
        payload.newPassword
      ).pipe(Effect.orDie);

      const db = yield* PgDrizzle;

      yield* db
        .update(UsersTable)
        .set({
          password: newPasswordHash,
        })
        .where(eq(UsersTable.id, jwtPayload.sub))
        .pipe(Effect.orDie);

      return new UserChangePasswordResponse({
        newPassword: payload.newPassword,
      });
    })
);
