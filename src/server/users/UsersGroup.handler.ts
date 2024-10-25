import { HttpApiBuilder } from "@effect/platform";
import { DataLounaApi } from "../../api_spec/Api.ts";
import { UsersChangePasswordHandler } from "./UsersChangePassword.handler.ts";
import { UsersLoginHandler } from "./UsersLogin.handler.ts";

export const UserApiGroupLive = HttpApiBuilder.group(
  DataLounaApi,
  "users",
  (handlers) =>
    handlers
      .handle("changePassword", UsersChangePasswordHandler)
      .handle("login", UsersLoginHandler)
);
