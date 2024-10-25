import { pipe, Redacted, Schema } from "effect";

export const RefreshTokenSymbol: unique symbol =
  Symbol.for("RefreshTokenSymbol");

export class RefreshToken extends Schema.Redacted(Schema.String)
  .pipe(Schema.brand(RefreshTokenSymbol))
  .annotations({
    identifier: "RefreshToken",
    title: "RefreshToken",
  }) {
  static fromString = (value: string): typeof RefreshToken.Type =>
    pipe(value, Redacted.make, this.make);
}
