import { GraphQLError } from "graphql";

export class UserAlreadyExistsError extends GraphQLError {
  constructor(message: string = "User already exists") {
    super(message, { extensions: { code: "USER_ALREADY_EXISTS" } });
  }
}

export class UserCreationFailedError extends GraphQLError {
  constructor(message: string = "User creation failed") {
    super(message, { extensions: { code: "USER_CREATION_FAILED" } });
  }
}

export class InvalidCredentialsError extends GraphQLError {
  constructor(message: string = "Invalid email or password") {
    super(message, { extensions: { code: "INVALID_CREDENTIALS" } });
  }
}

export class MissingEnvVarError extends GraphQLError {
  constructor(varName: string) {
    super(`${varName} is not defined in environment variables`, {
      extensions: { code: "MISSING_ENV_VAR", variable: varName },
    });
  }
}

export class MembershipAlreadyExistsError extends GraphQLError {
  constructor(message: string = "User is already a member of this organization") {
    super(message, { extensions: { code: "MEMBERSHIP_ALREADY_EXISTS" } });
  }
}

export class InvitationFailedError extends GraphQLError {
  constructor(message: string = "Failed to create user invitation") {
    super(message, { extensions: { code: "INVITATION_FAILED" } });
  }
}

export class AuthTokenError extends GraphQLError {
  constructor(message: string = "Invalid or expired token") {
    super(message, { extensions: { code: "AUTH_TOKEN_ERROR" } });
  }
}
