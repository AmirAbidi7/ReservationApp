import { ClerkClient } from "@clerk/backend";
import { Effect } from "effect";
import { InternalServerError } from "../errors/ApiErrors";

export const getEmail = (clerk: ClerkClient, userId: string) =>
  Effect.tryPromise({
    try: async () => {
      const user = await clerk.users.getUser(userId);
      return user.emailAddresses[0].emailAddress;
    },

    catch: () => new InternalServerError(),
  });
