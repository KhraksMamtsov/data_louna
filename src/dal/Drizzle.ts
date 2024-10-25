import * as PgDrizzle from "@effect/sql-drizzle/Pg";
import { Layer } from "effect";
import { SqlLive } from "./Sql.ts";

export const DrizzleLive = PgDrizzle.layer.pipe(Layer.provideMerge(SqlLive));
