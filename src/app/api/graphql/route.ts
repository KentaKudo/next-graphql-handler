import { Hono } from "hono";

const app = new Hono()
  .basePath("/api")
  .get("/graphql", (c) => c.json({ message: "Hello World" }));

export const GET = app.fetch;
export const POST = app.fetch;
