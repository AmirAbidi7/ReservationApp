import { ClerkClient, createClerkClient } from "@clerk/backend";
import { Context, Effect, Layer } from "effect";

export class ClerkService extends Context.Service<ClerkService, ClerkClient>()("ClerkClient", {
  make: Effect.sync(() => createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! })),
}) {}

export const ClerkServiceLive = Layer.effect(ClerkService, ClerkService.make);
