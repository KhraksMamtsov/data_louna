import { HttpApiBuilder } from "@effect/platform";
import { SqlClient } from "@effect/sql";
import { PgDrizzle } from "@effect/sql-drizzle/Pg";
import { Array, BigDecimal, Effect } from "effect";
import { DataLounaApi } from "../../api_spec/Api.ts";
import {
  AuthorizedSession,
  UnauthorizedError,
} from "../../api_spec/Authorization.security.ts";
import {
  InsufficientFundsError,
  ItemNotFoundError,
  OutOfStockError,
  PaymentsBuyResponse,
} from "../../api_spec/payments/Payments.BuyItem.endpoint.ts";
import { ItemsTable, UsersTable } from "../../dal/schema.ts";
import { eq } from "drizzle-orm";

export const PaymentsApiGroupLive = HttpApiBuilder.group(
  DataLounaApi,
  "payments",
  (handlers) =>
    handlers.handle("buyItem", ({ payload }) =>
      Effect.gen(function* () {
        const { currentUser } = yield* AuthorizedSession;
        const db = yield* PgDrizzle;
        const sql = yield* SqlClient.SqlClient;

        const updatedBalance = yield* sql
          .withTransaction(
            Effect.gen(function* () {
              const items = yield* db
                .select()
                .from(ItemsTable)
                .where(eq(ItemsTable.id, payload.itemId))
                .for("update");

              if (!Array.isNonEmptyArray(items)) {
                return yield* new ItemNotFoundError();
              }
              const [item] = items;

              if (item.quantity <= 0) {
                yield* new OutOfStockError();
              }

              const users = yield* db
                .select()
                .from(UsersTable)
                .where(eq(UsersTable.id, currentUser.id))
                .for("update");

              if (!Array.isNonEmptyArray(users)) {
                return yield* new UnauthorizedError();
              }
              const [user] = users;

              const balance = BigDecimal.unsafeFromString(user.balance);
              const price = BigDecimal.unsafeFromString(item.price);

              if (BigDecimal.greaterThan(price, balance)) {
                return yield* new InsufficientFundsError();
              }

              const newBalance = BigDecimal.subtract(balance, price);

              yield* db
                .update(ItemsTable)
                .set({
                  quantity: item.quantity - 1,
                })
                .where(eq(ItemsTable.id, item.id));

              const updatedUsersBalances = yield* db
                .update(UsersTable)
                .set({ balance: BigDecimal.format(newBalance) })
                .where(eq(UsersTable.id, user.id))
                .returning({
                  balance: UsersTable.balance,
                });

              if (!Array.isNonEmptyArray(updatedUsersBalances)) {
                return yield* new UnauthorizedError();
              }
              const [updatedUserBalance] = updatedUsersBalances;

              return BigDecimal.unsafeFromString(updatedUserBalance.balance);
            })
          )
          .pipe(
            Effect.catchTags({
              SqlError: Effect.die,
            })
          );

        return new PaymentsBuyResponse({
          balance: updatedBalance,
        });
      })
    )
);
