import {
  HttpApi,
  HttpApiBuilder,
  HttpServerResponse,
  OpenApi,
} from "@effect/platform";
import { Effect, Layer } from "effect";

export const layer = (options?: {
  readonly path?: `/${string}` | undefined;
}): Layer.Layer<never, never, HttpApi.Api> =>
  HttpApiBuilder.Router.use((router) =>
    Effect.gen(function* () {
      const { api } = yield* HttpApi.Api;
      const spec = OpenApi.fromApi(api);
      const response = HttpServerResponse.html(`<!doctype html>
<html>
  <head>
    <title>Scalar API Reference</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script
  id="api-reference"
  type="application/json">
  ${JSON.stringify(spec)}
</script>

    <!-- Optional: You can set a full configuration object like this: -->
    <script>
      var configuration = {
        theme: 'deepSpace',
      }

      document.getElementById('api-reference').dataset.configuration =
        JSON.stringify(configuration)
    </script>

    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`);

      yield* router.get(options?.path ?? "/scalar", Effect.succeed(response));
    })
  );
