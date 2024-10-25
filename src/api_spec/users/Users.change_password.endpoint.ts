import { HttpApiEndpoint, OpenApi } from "@effect/platform";
import { Schema } from "effect";
import { Authorization } from "../Authorization.security.ts";

export class UserChangePasswordRequest extends Schema.Class<UserChangePasswordRequest>(
  "UserChangePasswordRequest"
)({
  password: Schema.Redacted(Schema.String),
  newPassword: Schema.Redacted(Schema.String),
}) {}

export class WrongPasswordError extends Schema.TaggedError<WrongPasswordError>()(
  "WrongPasswordError",
  {}
) {}

export class WeakPasswordError extends Schema.TaggedError<WeakPasswordError>()(
  "WeakPasswordError",
  { message: Schema.String }
) {}

export class UserChangePasswordResponse extends Schema.TaggedClass<UserChangePasswordResponse>(
  "UserChangePasswordResponse"
)("UserChangePasswordResponse", {}) {}

export const UserChangePasswordEndpoint = HttpApiEndpoint.post(
  "changePassword",
  "/change_password"
)
  .annotate(OpenApi.Description, "Смена пароля")
  .setPayload(UserChangePasswordRequest)
  .addSuccess(UserChangePasswordResponse)
  .addError(WrongPasswordError, { status: 401 })
  .addError(WeakPasswordError, { status: 400 })
  .middleware(Authorization);
