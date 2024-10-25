import { Schema } from "effect";
import { IdUser } from "./IdUser.domain.ts";

export class User extends Schema.Class<User>("User")({
  id: IdUser,
  login: Schema.String,
  password: Schema.Redacted(Schema.String),
  balance: Schema.NumberFromString.annotations({
    identifier: "Balance",
  }).pipe(Schema.compose(Schema.BigDecimalFromNumber, { strict: true })),
}) {
  static decode = Schema.decode(this, {
    errors: "all",
    exact: true,
  });
}
