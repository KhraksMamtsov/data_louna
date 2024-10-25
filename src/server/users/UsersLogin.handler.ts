import { Effect, Redacted } from "effect";
import {
  WrongCredentialsError,
  UserAuthResponse,
} from "../../api_spec/users/Users.auth.endpoint.ts";
import { JwtService } from "../services/jwt/Jwt.service.ts";
import { PasswordService } from "../services/Password.service.ts";
import { UsersRepo } from "../../dal/Users.repo.ts";
import { HttpApiBuilder } from "@effect/platform";
import { DataLounaApi } from "../../api_spec/Api.ts";

export const UsersLoginHandler = HttpApiBuilder.handler(
  DataLounaApi,
  "users",
  "login",
  ({ payload }) =>
    Effect.gen(function* () {
      const user = yield* UsersRepo.getUserByLogin(payload.login).pipe(
        Effect.flatten,
        Effect.catchTags({
          NoSuchElementException: () => new WrongCredentialsError(),
        })
      );

      const isCurrentPasswordCorrect = yield* PasswordService.compare(
        payload.password,
        Redacted.value(user.password)
      ).pipe(Effect.orDie);

      if (!isCurrentPasswordCorrect) {
        return yield* new WrongCredentialsError();
      }

      const tokens = yield* JwtService.sign({ sub: user.id });

      return new UserAuthResponse({
        ...tokens,
        user,
      });
    })
);
