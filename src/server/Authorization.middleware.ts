import { Effect, Layer } from "effect";
import {
  Authorization,
  UnauthorizedError,
} from "../api_spec/Authorization.security.ts";
import { JwtService, JWTServiceErrorType } from "./services/jwt/Jwt.service.ts";
import { UsersRepo } from "../dal/Users.repo.ts";
import { IdUser } from "../domain/IdUser.domain.ts";

export const AuthorizationLive = Layer.effect(
  Authorization,
  Effect.gen(function* () {
    const jwtService = yield* JwtService;
    const usersRepo = yield* UsersRepo;

    return Authorization.of({
      authBearer: (token) =>
        Effect.gen(function* () {
          const jwtPayload = yield* jwtService
            .verifyAndDecode({ token, type: "accessToken" })
            .pipe(
              Effect.catchTags({
                [JWTServiceErrorType.VERIFY]: () => new UnauthorizedError(),
              })
            );

          const currentUser = yield* usersRepo
            .getUserById(IdUser.make(jwtPayload.sub))
            .pipe(
              Effect.flatten,
              Effect.catchTags({
                NoSuchElementException: () => new UnauthorizedError(),
              })
            );

          return {
            jwtPayload,
            currentUser,
          };
        }),
    });
  })
);
