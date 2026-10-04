import { Data } from "effect";
import { StatusCodes } from "http-status-codes";

export class NotFoundError extends Data.TaggedError("NotFoundError")<{
  message?: string;
}> {
  readonly code = StatusCodes.NOT_FOUND;
  readonly message: string;

  constructor(args: { message?: string } = {}) {
    super(args);
    this.message = args.message ?? "Not found";
  }
}

export class UnauthorizedError extends Data.TaggedError("UnauthorizedError")<{
  message?: string;
}> {
  readonly code = StatusCodes.UNAUTHORIZED;
  readonly message: string;

  constructor(args: { message?: string } = {}) {
    super(args);
    this.message = args.message ?? "Unauthorized";
  }
}

export class InternalServerError extends Data.TaggedError("InternalServerError")<{
  message?: string;
}> {
  readonly code = StatusCodes.INTERNAL_SERVER_ERROR;
  message: string;

  constructor(args: { message?: string } = {}) {
    super(args);
    this.message = args.message ?? "Internal Server Error";
  }
}

export class ItemExistsError extends Data.TaggedError("ItemExistsError")<{
  message?: string;
}> {
  readonly code = StatusCodes.BAD_REQUEST;
  readonly message: string;

  constructor(args: { message?: string } = {}) {
    super(args);
    this.message = args.message ?? "Item already exists!";
  }
}

export class BadRequestError extends Data.TaggedError("BadRequestError")<{
  message?: string;
}> {
  readonly code = StatusCodes.BAD_REQUEST;
  message: string;

  constructor(args: { message?: string } = {}) {
    super(args);
    this.message = args.message ?? "Bad Request";
  }
}

export type APIError = NotFoundError | UnauthorizedError | InternalServerError;
