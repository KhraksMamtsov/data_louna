import { Schema, pipe, Redacted } from "effect";

export const AccessTokenSymbol: unique symbol = Symbol.for("AccessTokenSymbol");

export class AccessToken extends Schema.Redacted(Schema.String)
  .pipe(Schema.brand(AccessTokenSymbol))
  .annotations({
    identifier: "AccessToken",
    title: "AccessToken",
  }) {
  static fromString = (value: string): typeof AccessToken.Type =>
    pipe(value, Redacted.make, this.make);
}
