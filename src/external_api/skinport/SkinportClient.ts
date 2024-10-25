import { Config, Effect, Schema } from "effect";
import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
  FetchHttpClient,
} from "@effect/platform";
import { SkinportItemSchema } from "./SkinportItem.schema.ts";

export class SkinportClient extends Effect.Service<SkinportClient>()(
  "SkinportClient",
  {
    accessors: true,
    dependencies: [FetchHttpClient.layer],
    effect: Effect.gen(function* () {
      const skinportApiURL = yield* Config.string("SKINPORT_API_URL").pipe(
        Config.mapAttempt((x) => new URL(x))
      );

      const client = (yield* HttpClient.HttpClient).pipe(
        HttpClient.tapRequest(Effect.log)
      );

      const itemsURL = new URL("items", skinportApiURL);

      return {
        getItems: (options: { tradeable: boolean }) =>
          HttpClientRequest.get(itemsURL).pipe(
            HttpClientRequest.appendUrlParams({
              tradable: options.tradeable ? "1" : "0",
            }),
            client.execute,
            Effect.flatMap(HttpClientResponse.filterStatusOk),
            Effect.flatMap(
              HttpClientResponse.schemaBodyJson(
                Schema.Array(SkinportItemSchema)
              )
            ),
            Effect.scoped
          ),
      };
    }),
  }
) {}
