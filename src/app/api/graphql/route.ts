import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { schema } from "./schema";

const yoga = createYoga({
  graphqlEndpoint: "/api/graphql",
  fetchAPI: {
    fetch,
    Request,
    ReadableStream,
    Response,
  },
  schema,
});

const app = new Hono()
  .basePath("/api")
  .mount("/graphql", yoga, { replaceRequest: (req) => req });

export const GET = app.fetch;
export const POST = app.fetch;
