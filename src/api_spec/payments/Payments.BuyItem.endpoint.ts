import { HttpApiEndpoint } from "@effect/platform";
import { Schema } from "effect";
import { User } from "../../domain/User.domain.ts";

export class PaymentsBuyRequest extends Schema.Class<PaymentsBuyRequest>(
  "PaymentsBuyRequest"
)({
  itemId: Schema.String,
}) {}

export class PaymentsBuyResponse extends Schema.TaggedClass<PaymentsBuyResponse>(
  "UserAuthResponse"
)("UserAuthResponse", {
  balance: User.fields.balance,
}) {}

export class ItemNotFoundError extends Schema.TaggedError<ItemNotFoundError>(
  "ItemNotFoundError"
)("ItemNotFoundError", {}) {}

export class OutOfStockError extends Schema.TaggedError<OutOfStockError>(
  "OutOfStockError"
)("OutOfStockError", {}) {}

export class InsufficientFundsError extends Schema.TaggedError<InsufficientFundsError>(
  "InsufficientFundsError"
)("InsufficientFundsError", {}) {}

export const PaymentsBuyEndpoint = HttpApiEndpoint.post("buyItem", "/buy_item")
  .setPayload(PaymentsBuyRequest)
  .addSuccess(PaymentsBuyResponse)
  .addError(ItemNotFoundError, { status: 404 })
  .addError(OutOfStockError, { status: 404 })
  .addError(InsufficientFundsError, { status: 402 });
