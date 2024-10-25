import { HttpApiBuilder } from "@effect/platform";
import { Duration, Effect, Either, Schedule } from "effect";
import { DataLounaApi } from "../../api_spec/Api.ts";
import {
  BadGatewayError,
  ItemDto,
  GetItemsResponse,
} from "../../api_spec/items/Items.GetItems.endpoint.ts";
import { SkinportClient } from "../../external_api/skinport/SkinportClient.ts";
import { SkinportItemSchema } from "../../external_api/skinport/SkinportItem.schema.ts";
import { RedisService } from "../services/Redis.service.ts";

const ITEMS_CACHE_KEY = "ITEMS";

const getItemsFromCache = () =>
  Effect.gen(function* () {
    const redis = yield* RedisService;
    const value = yield* redis.get(ITEMS_CACHE_KEY).pipe(Effect.flatten);

    return yield* ItemDto.decodeJSON(value);
  });

const saveItemsToCache = (items: typeof ItemDto.json.Type) =>
  Effect.gen(function* () {
    const redis = yield* RedisService;

    const encodedItems = yield* ItemDto.encodeJSON(items);
    yield* redis.set(ITEMS_CACHE_KEY, encodedItems, {
      EX: Duration.toSeconds("5 minutes"),
    });
  });

export const ItemsApiGroupLive = HttpApiBuilder.group(
  DataLounaApi,
  "items",
  (handlers) =>
    handlers.handle("getItems", () =>
      Effect.gen(function* () {
        const cachedItems = yield* getItemsFromCache().pipe(Effect.either);

        if (Either.isRight(cachedItems)) {
          return new GetItemsResponse({
            items: cachedItems.right,
          });
        }

        const skinportItems = yield* Effect.all(
          {
            tradeable: SkinportClient.getItems({ tradeable: true }).pipe(
              Effect.retry({
                times: 3,
                schedule: Schedule.exponential("1 second"),
              })
            ),
            notTradeable: SkinportClient.getItems({ tradeable: false }).pipe(
              Effect.retry({
                times: 3,
                schedule: Schedule.exponential("1 second"),
              })
            ),
          },
          { concurrency: "unbounded" }
        ).pipe(Effect.catchAll((x) => new BadGatewayError()));

        const tradeableMap = new Map<string, SkinportItemSchema>();

        skinportItems.tradeable.forEach((x) => {
          tradeableMap.set(x.market_hash_name, x);
        });

        const mergedItems = skinportItems.notTradeable.map(
          (x) =>
            new ItemDto({
              name: x.market_hash_name,
              minPrice: {
                notTradeable: x.min_price,
                tradeable:
                  tradeableMap.get(x.market_hash_name)?.min_price ?? null,
              },
            })
        );

        yield* Effect.fork(saveItemsToCache(mergedItems));

        return new GetItemsResponse({
          items: mergedItems,
        });
      })
    )
);
