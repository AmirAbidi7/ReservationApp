import { ClerkClient } from "@clerk/backend";
import { eq } from "drizzle-orm";
import { Context, Effect, Layer } from "effect";
import { ClerkService, ClerkServiceLive } from "../config/clerkClient";
import { Database, DatabaseLive, Db } from "../config/db";
import { CreateUserRequest, UserResponse } from "../dto/UserDTO";
import { InternalServerError, ItemExistsServerError, NotFoundError } from "../errors/ApiErrors";
import { getEmail } from "../helper/clerk";
import { userRole, usersTable } from "../model/user";

type UserServiceInterface = {
  readonly createUser: (
    userId: string,
    user: CreateUserRequest,
  ) => Effect.Effect<UserResponse, ItemExistsServerError | InternalServerError>;
  readonly deleteUser: (userId: string) => Effect.Effect<void, NotFoundError | InternalServerError>;
  readonly updateUser: (
    userId: string,
    user: CreateUserRequest,
  ) => Effect.Effect<UserResponse, NotFoundError | InternalServerError>;
  readonly getUser: (
    userid: string,
  ) => Effect.Effect<UserResponse, NotFoundError | InternalServerError>;
};

export class UserService extends Context.Service<UserService, UserServiceInterface>()(
  "UserService",
) {}

export const toUserResponseDTO = (
  user: {
    id: string;
    firstName: string;
    lastName: string;
    role: userRole;
  },
  email: string,
): UserResponse => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: email,
  role: user.role,
});

const createUser = (db: Db, clerk: ClerkClient) => (userId: string, user: CreateUserRequest) =>
  Effect.gen(function* () {
    const [userExists] = yield* Effect.tryPromise({
      try: () => db.select().from(usersTable).where(eq(usersTable.id, userId)),
      catch: () => new InternalServerError(),
    });

    if (userExists) {
      return yield* Effect.fail(new ItemExistsServerError());
    }

    const [newUser] = yield* Effect.tryPromise({
      try: () =>
        db
          .insert(usersTable)
          .values({
            id: userId,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          })
          .returning(),
      catch: () => new InternalServerError(),
    });

    const email = yield* getEmail(clerk, userId);

    return toUserResponseDTO(newUser, email);
  });

const deleteUser =
  (db: Db) =>
  (userId: string): Effect.Effect<void, InternalServerError | NotFoundError> =>
    Effect.gen(function* () {
      const [user] = yield* Effect.tryPromise({
        try: () => db.delete(usersTable).where(eq(usersTable.id, userId)).returning(),
        catch: () => new InternalServerError(),
      });
      if (!user) {
        return yield* Effect.fail(new NotFoundError());
      }

      return;
    });

const getUser = (db: Db, clerk: ClerkClient) => (userId: string) =>
  Effect.gen(function* () {
    const [user] = yield* Effect.tryPromise({
      try: () => db.select().from(usersTable).where(eq(usersTable.id, userId)),
      catch: () => new InternalServerError(),
    });
    if (!user) {
      return yield* Effect.fail(new NotFoundError());
    }

    const email = yield* getEmail(clerk, userId);

    return toUserResponseDTO(user, email);
  });

const updateUser = (db: Db, clerk: ClerkClient) => (userId: string, user: CreateUserRequest) =>
  Effect.gen(function* () {
    const [newUser] = yield* Effect.tryPromise({
      try: () =>
        db
          .update(usersTable)
          .set({ firstName: user.firstName, lastName: user.lastName })
          .returning(),
      catch: () => new InternalServerError(),
    });

    if (!newUser) {
      return yield* Effect.fail(new NotFoundError());
    }

    const email = yield* getEmail(clerk, userId);

    return toUserResponseDTO(user, email);
  });

const UserServiceLive = Layer.effect(
  UserService,
  Effect.gen(function* () {
    const db = yield* Database;
    const clerk = yield* ClerkService;

    return UserService.of({
      createUser: createUser(db, clerk),
      deleteUser: deleteUser(db),
      updateUser: updateUser(db, clerk),
      getUser: getUser(db, clerk),
    });
  }),
).pipe(Layer.provide(DatabaseLive), Layer.provide(ClerkServiceLive));
