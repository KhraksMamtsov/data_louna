import { HttpApiGroup } from "@effect/platform";
import { GetItemsEndpoint } from "./Items.GetItems.endpoint.ts";
import { Authorization } from "../Authorization.security.ts";

export class ItemsApiGroup extends HttpApiGroup.make("items")
  .add(GetItemsEndpoint)
  .middleware(Authorization) {}
