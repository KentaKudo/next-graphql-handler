import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import SchemaBuilder from "@pothos/core";

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || "World"}`,
    }),
  }),
});

const yoga = createYoga({
  graphqlEndpoint: "/api/graphql",
  fetchAPI: {
    fetch,
    Request,
    ReadableStream,
    Response,
  },
  schema: builder.toSchema(),
});

const app = new Hono()
  .basePath("/api")
  .mount("/graphql", yoga, { replaceRequest: (req) => req });

export const GET = app.fetch;
export const POST = app.fetch;
