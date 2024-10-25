import { HttpApiEndpoint, OpenApi } from "@effect/platform";
import { Schema } from "effect";
import { User } from "../../domain/User.domain.ts";
import { RefreshToken } from "../../server/RefreshToken.ts";
import { AccessToken } from "../../server/AccessToken.ts";

export class UserAuthRequest extends Schema.Class<UserAuthRequest>(
  "UserAuthRequest"
)({
  login: Schema.String,
  password: Schema.Redacted(Schema.String),
}) {}

export class WrongCredentialsError extends Schema.TaggedError<WrongCredentialsError>()(
  "WrongCredentialsError",
  {}
) {}

export class UserApi extends User.pipe(Schema.omit("password")).annotations({
  identifier: "UserApi",
}) {}

export class UserAuthResponse extends Schema.TaggedClass<UserAuthResponse>(
  "UserAuthResponse"
)("UserAuthResponse", {
  user: UserApi,
  refreshToken: RefreshToken,
  accessToken: AccessToken,
}) {}

export const UserAuthEndpoint = HttpApiEndpoint.post("login", "/login")
  .annotate(OpenApi.Description, "- ofkjubyb")
  .setPayload(UserAuthRequest)
  .addSuccess(UserAuthResponse)
  .addError(WrongCredentialsError, { status: 404 });
