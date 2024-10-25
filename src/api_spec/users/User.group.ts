import { HttpApiGroup } from "@effect/platform";
import { UserAuthEndpoint } from "./Users.auth.endpoint.ts";
import { UserChangePasswordEndpoint } from "./Users.change_password.endpoint.ts";

export class UsersApiGroup extends HttpApiGroup.make("users")
  .add(UserAuthEndpoint)
  .add(UserChangePasswordEndpoint) {}
