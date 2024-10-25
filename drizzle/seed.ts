import { PgDrizzle } from "@effect/sql-drizzle/Pg";
import { Effect, Logger } from "effect";
import { ItemsTable, UsersTable } from "../src/dal/schema.ts";
import { DrizzleLive } from "../src/dal/Drizzle.ts";

const seed = Effect.gen(function* () {
  yield* Effect.log(`Start seeding`);

  const db = yield* PgDrizzle;

  const users = yield* db
    .insert(UsersTable)
    .values([
      {
        login: "John Doe",
        password:
          "fbc1b1723efce311fa8eb96a280836bd274aba8ec6d2a3eb6d3be5929c94739a", // pass
        id: "00000000-0000-0000-0000-000000000000",
        balance: "111108.27",
      },
    ])
    .returning();

  yield* Effect.log(`Created users: `, users);

  const items = yield* db
    .insert(ItemsTable)
    .values([
      {
        quantity: 2,
        id: "00000000-0000-0000-0000-000000000000",
        price: "10.00",
      },
      {
        quantity: 1,
        id: "11111111-1111-1111-1111-111111111111",
        price: "20.00",
      },
    ])
    .returning();

  yield* Effect.log(`Created items: `, items);
}).pipe(Effect.provide(DrizzleLive), Effect.provide(Logger.pretty));

Effect.runPromise(seed);
