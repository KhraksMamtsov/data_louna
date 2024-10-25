import { defineConfig } from "drizzle-kit";
import { Schema } from "effect";

const ConfigSchema = Schema.Struct({
  POSTGRES_HOST: Schema.String,
  POSTGRES_PORT: Schema.String,
  POSTGRES_DB: Schema.String,
  POSTGRES_USER: Schema.String,
  POSTGRES_PASSWORD: Schema.String,
});

const validEnv = Schema.validateSync(ConfigSchema)(process.env);

export default defineConfig({
  out: "./drizzle",
  schema: "./src/dal/schema.ts",
  dialect: "postgresql",
  // casing: "snake_case",
  verbose: true,
  dbCredentials: {
    url: `postgres://${
      //
      validEnv.POSTGRES_USER!
    }:${
      //
      validEnv.POSTGRES_PASSWORD!
    }@${
      //
      validEnv.POSTGRES_HOST!
    }:${
      //
      validEnv.POSTGRES_PORT!
    }/${
      //
      validEnv.POSTGRES_DB
    }`,
  },
});
