import { HttpApi, OpenApi } from "@effect/platform";

import { UsersApiGroup } from "./users/User.group.ts";
import { PaymentsApiGroup } from "./payments/Payments.group.ts";
import { ItemsApiGroup } from "./items/Items.group.ts";

export class DataLounaApi extends HttpApi.empty
  .annotateContext(
    OpenApi.annotations({
      title: "DataLouna test task API",
    })
  )
  .add(UsersApiGroup)
  .add(ItemsApiGroup)
  .add(PaymentsApiGroup) {}
