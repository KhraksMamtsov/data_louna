import { Schema } from "effect";

/**
 * @example
 * ```json
 * { "market_hash_name": "10 Year Birthday Sticker Capsule",
 * "currency": "EUR",
 * "market_hash_name": "10 Year Birthday Sticker Capsule",
 * "currency": "EUR",
 * "suggested_price": 0.9,
 * "item_page": "https://skinport.com/item/10-year-birthday-sticker-capsule",
 * "market_page": "https://skinport.com/market?item=10%20Year%20Birthday%20Sticker%20Capsule&cat=Container",
 * "min_price": 0.92,
 * "max_price": 4.05,
 * "mean_price": 1.44,
 * "median_price": 1.19,
 * "quantity": 311,
 * "created_at": 1661324437,
 * "updated_at": 1729681675 }
  ```
 */
export class SkinportItemSchema extends Schema.Class<SkinportItemSchema>(
  "SkinportItemSchema"
)({
  market_hash_name: Schema.String,
  min_price: Schema.Union(Schema.BigDecimalFromNumber, Schema.Null),
}) {
  static decodeSync = Schema.decodeSync(this);
}
