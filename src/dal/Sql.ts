import { PgClient } from "@effect/sql-pg";
import { Config, String } from "effect";

export const SqlLive = PgClient.layer({
  database: Config.string("POSTGRES_DB"),
  username: Config.string("POSTGRES_USER"),
  password: Config.redacted("POSTGRES_PASSWORD"),
  host: Config.string("POSTGRES_HOST"),
  port: Config.number("POSTGRES_PORT"),
  transformQueryNames: Config.succeed(String.camelToSnake),
  transformResultNames: Config.succeed(String.snakeToCamel),
});
