import { PgDrizzle } from "@effect/sql-drizzle/Pg";
import { Effect, Logger } from "effect";
import { ItemsTable, UsersTable } from "../src/dal/schema.ts";
import { DrizzleLive } from "../src/dal/Drizzle.ts";

const seed = Effect.gen(function* () {
  yield* Effect.log(`Start unseeding`);

  const db = yield* PgDrizzle;

  const users = yield* db.delete(UsersTable).returning();

  yield* Effect.log(`Deleted users: `, users);
  const items = yield* db.delete(ItemsTable).returning();

  yield* Effect.log(`Deleted items: `, items);
}).pipe(Effect.provide(DrizzleLive), Effect.provide(Logger.pretty));

Effect.runPromise(seed);
