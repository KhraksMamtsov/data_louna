import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as D from "drizzle-orm/pg-core";

export const UsersTable = D.pgTable("users", {
  id: D.uuid("id").primaryKey().defaultRandom().notNull(),
  login: D.text("login").notNull(),
  password: D.varchar("password", { length: 255 }).notNull(),
  balance: D.decimal("balance", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
});

export declare namespace UsersTable {
  export interface SelectModel extends InferSelectModel<typeof UsersTable> {}
  export interface InsertModel extends InferInsertModel<typeof UsersTable> {}
}

export const ItemsTable = D.pgTable("items", {
  id: D.uuid("id").primaryKey().defaultRandom().notNull(),
  quantity: D.integer("quantity").notNull(),
  price: D.decimal("balance", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
});
