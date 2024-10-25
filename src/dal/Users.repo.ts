import { Effect, Array } from "effect";
import { IdUser } from "../domain/IdUser.domain.ts";
import { PgDrizzle } from "@effect/sql-drizzle/Pg";
import { UsersTable } from "./schema.ts";
import { eq } from "drizzle-orm";
import { User } from "../domain/User.domain.ts";

export class UsersRepo extends Effect.Service<UsersRepo>()("UsersRepo", {
  accessors: true,
  effect: Effect.gen(function* () {
    const db = yield* PgDrizzle;

    return {
      getUserById: (id: IdUser) =>
        Effect.gen(function* () {
          const usersWithId: Array<UsersTable.SelectModel> = yield* db
            .select()
            .from(UsersTable)
            .where(eq(UsersTable.id, id))
            .limit(1);

          return yield* Array.get(usersWithId, 0).pipe(
            Effect.flatMap(User.decode),
            Effect.optionFromOptional,
            Effect.orDie
          );
        }).pipe(Effect.orDie),
      getUserByLogin: (login: string) =>
        Effect.gen(function* () {
          const usersWithLogin: Array<UsersTable.SelectModel> = yield* db
            .select()
            .from(UsersTable)
            .where(eq(UsersTable.login, login))
            .limit(1)
            .pipe(Effect.orDie);

          return yield* Array.get(usersWithLogin, 0).pipe(
            Effect.flatMap(User.decode),
            Effect.optionFromOptional,
            Effect.orDie
          );
        }),
    };
  }),
}) {}
