import { Layer } from "effect";
import {
  HttpApiBuilder,
  HttpApiSwagger,
  HttpMiddleware,
  HttpServer,
} from "@effect/platform";
import { createServer } from "node:http";
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { DataLounaApi } from "./api_spec/Api.ts";
import { JwtService } from "./server/services/jwt/Jwt.service.ts";
import { DrizzleLive } from "./dal/Drizzle.ts";
import { PasswordService } from "./server/services/Password.service.ts";
import { AuthorizationLive } from "./server/Authorization.middleware.ts";
import { UsersRepo } from "./dal/Users.repo.ts";
import * as Scalar from "./Scalar.ts";
import { SkinportClient } from "./external_api/skinport/SkinportClient.ts";
import { UserApiGroupLive } from "./server/users/UsersGroup.handler.ts";
import { ItemsApiGroupLive } from "./server/items/ItemsGroup.handler.ts";
import { PaymentsApiGroupLive } from "./server/payments/PaymentsGroup.handler.ts";
import { RedisService } from "./server/services/Redis.service.ts";

const DataLounaApiLive = HttpApiBuilder.api(DataLounaApi).pipe(
  Layer.provide(ItemsApiGroupLive),
  Layer.provide(UserApiGroupLive),
  Layer.provide(PaymentsApiGroupLive)
);

const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(
    HttpApiBuilder.middlewareOpenApi({ path: "/docs/openapi.json" })
  ),
  Layer.provide(HttpApiSwagger.layer({ path: "/docs/swagger" })),
  Layer.provide(Scalar.layer({ path: "/docs/scalar" })),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
  Layer.provide(DataLounaApiLive),
  Layer.provide(PasswordService.Default),
  Layer.provide(AuthorizationLive),
  Layer.provide(JwtService.Default),
  Layer.provide(SkinportClient.Default),
  Layer.provide(RedisService.Default),
  Layer.provide(UsersRepo.Default.pipe(Layer.provideMerge(DrizzleLive)))
);

Layer.launch(HttpLive).pipe(NodeRuntime.runMain);
