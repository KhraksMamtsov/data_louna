import { Schema } from "effect";

export const IdUserSymbol: unique symbol = Symbol.for("IdUserSymbol");
export const IdUser = Schema.UUID.pipe(Schema.brand(IdUserSymbol)).annotations({
  title: "IdUser",
  identifier: "IdUser",
});
export type IdUser = typeof IdUser.Type;
