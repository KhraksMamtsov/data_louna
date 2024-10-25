import { HttpApiGroup } from "@effect/platform";
import { PaymentsBuyEndpoint } from "./Payments.BuyItem.endpoint.ts";
import { Authorization } from "../Authorization.security.ts";

export class PaymentsApiGroup extends HttpApiGroup.make("payments")
  .add(PaymentsBuyEndpoint)
  .middleware(Authorization) {}
