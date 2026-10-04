import { SessionAuthObject } from "@clerk/backend";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";

const app = new Hono();

app.use("*", clerkMiddleware());

app.get("/", async (c) => {
  const auth: SessionAuthObject = getAuth(c);

  return c.text("Hello Hono!");
});

export default app;
