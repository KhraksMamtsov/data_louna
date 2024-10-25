import {
  Chunk,
  Config,
  Data,
  Effect,
  Option,
  Redacted,
  Stream,
  flow,
} from "effect";
import { createClient, type RedisClientOptions } from "redis";

export interface RedisClient extends ReturnType<typeof createClient> {}

export class CacheConnectError extends Data.TaggedError("CacheConnectError")<{
  readonly cause: unknown;
}> {}
export class CacheError extends Data.TaggedError("CacheError")<{
  readonly cause: unknown;
}> {}
export class CacheGetError extends Data.TaggedError("CacheGetError")<{
  readonly cause: unknown;
}> {}
export class CacheSetError extends Data.TaggedError("CacheSetError")<{
  readonly cause: unknown;
}> {}
export class CacheHDelError extends Data.TaggedError("CacheHDelError")<{
  readonly cause: unknown;
}> {}
export class CacheHSetError extends Data.TaggedError("CacheHSetError")<{
  readonly cause: unknown;
}> {}

export interface RedisOptions extends RedisClientOptions {}
export type GetParameters = Parameters<RedisClient["get"]>;
export type HGetParameters = Parameters<RedisClient["hGet"]>;
export type HDelParameters = Parameters<RedisClient["hDel"]>;
export type HSetParameters = Parameters<RedisClient["hSet"]>;
export type SetParameters = Parameters<RedisClient["set"]>;

const makeClient = (client: RedisClient) => {
  return {
    get: (...args: GetParameters) =>
      Effect.tryPromise({
        try: () => client.get(...args),
        catch: (cause) => new CacheGetError({ cause }),
      })
        .pipe(Effect.map(Option.fromNullable))
        .pipe(Effect.withLogSpan("CacheService.get")),
    hDel: (...args: HDelParameters) =>
      Effect.tryPromise({
        catch: (cause) => new CacheHDelError({ cause }),
        try: () => client.hDel(...args),
      }).pipe(
        Effect.tapBoth({
          onFailure: Effect.logError,
          onSuccess: Effect.logInfo,
        }),
        Effect.withLogSpan("CacheService.hDel")
      ),
    hGet: (...args: HGetParameters) =>
      Effect.tryPromise({
        catch: (cause) => new CacheSetError({ cause }),
        try: () => client.hGet(...args),
      })
        .pipe(Effect.map(flow(Option.fromNullable, Option.map(Redacted.make))))
        .pipe(
          Effect.tapBoth({
            onFailure: Effect.logError,
            onSuccess: Effect.logInfo,
          }),
          Effect.withLogSpan("CacheService.hGet")
          // Effect.annotateLogs({ credentials, idTelegramChat })
        ),
    hSet: (...args: HSetParameters) =>
      Effect.tryPromise({
        catch: (cause) => new CacheHSetError({ cause }),
        try: () => client.hSet(...args),
      }).pipe(
        Effect.withLogSpan("CacheService.hSet")
        // Effect.annotateLogs({ credentials, idTelegramChat })
      ),
    set: (...args: SetParameters) =>
      Effect.tryPromise({
        catch: (cause) => new CacheSetError({ cause }),
        try: () => client.set(...args),
      }).pipe(
        Effect.withLogSpan("CacheService.set")
        // Effect.annotateLogs({ credentials, idTelegramChat })
      ),
  } as const;
};

export const initialize = (options?: RedisClientOptions) => {
  const client = createClient(options);

  const error$ = Stream.async<CacheError>((emit) => {
    console.log("client.on(error)");

    client.on("error", (cause: unknown) => {
      void emit(Effect.succeed(Chunk.of(new CacheError({ cause }))));
    });
  });

  return Effect.acquireRelease(
    Effect.tryPromise({
      catch: (cause) => new CacheConnectError({ cause }),
      try: () => client.connect(),
    }),
    (x) => Effect.promise(() => x.disconnect())
  ).pipe(Effect.map((client) => ({ client: makeClient(client), error$ })));
};

export class RedisService extends Effect.Service<RedisService>()(
  "RedisService",
  {
    accessors: true,
    scoped: Effect.gen(function* () {
      const password = yield* Config.redacted("REDIS_PASSWORD");
      const port = yield* Config.redacted("REDIS_PORT");
      const host = yield* Config.redacted("REDIS_HOST");

      const redisURL = new URL(
        `redis://:${Redacted.value(password)}@${Redacted.value(
          host
        )}:${Redacted.value(port)}`
      );

      const initResult = yield* initialize({
        url: redisURL.toString(),
      });

      return {
        ...initResult.client,
        asd: (...asd: [number] | [string, false]) => Effect.succeed(123),
      };
    }),
  }
) {}
