import { HttpApiEndpoint } from "@effect/platform";
import { Schema } from "effect";

export class GetItemsRequest extends Schema.Class<GetItemsRequest>(
  "GetItemsRequest"
)({}) {}

export class ItemDto extends Schema.Class<ItemDto>("ItemDto")({
  name: Schema.String,
  minPrice: Schema.Struct({
    tradeable: Schema.Union(Schema.BigDecimalFromNumber, Schema.Null),
    notTradeable: Schema.Union(Schema.BigDecimalFromNumber, Schema.Null),
  }),
}) {
  static json = Schema.parseJson(Schema.Array(this));
  static encodeJSON = Schema.encode(this.json);
  static decodeJSON = Schema.decode(this.json);
}

export class GetItemsResponse extends Schema.TaggedClass<GetItemsResponse>(
  "GetItemsResponse"
)("GetItemsResponse", {
  items: Schema.Array(ItemDto),
}) {}

export class BadGatewayError extends Schema.TaggedError<BadGatewayError>(
  "BadGatewayError"
)("BadGatewayError", {}) {}

export const GetItemsEndpoint = HttpApiEndpoint.get("getItems", "/get")
  .setPayload(GetItemsRequest)
  .addSuccess(GetItemsResponse)
  .addError(BadGatewayError, { status: 502 });
