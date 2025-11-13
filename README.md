# 🧩 Next GraphQL Handler

A minimal Next.js 16 project that keeps the entire GraphQL stack inside a Route Handler.  
Hono provides routing, GraphQL Yoga handles execution, and Pothos builds a fully type-safe schema.  
URQL powers both RSC data fetching and client components so the frontend and backend live in one repo.

## Highlights

- Next.js Route Handler + Hono = no separate API server or Lambdas to manage
- GraphQL Yoga edge-ready handler with shared `GET`/`POST` exports for `/api/graphql`
- Pothos GraphQL schema defined inline for fast iteration
- URQL set up for both server components (`registerUrql`) and client components
- GraphQL Code Generator preset that keeps `src/graphql/*` in sync with live schema

## Project Layout

```
schema.graphql          # Generated SDL snapshot
codegen.ts              # GraphQL Code Generator config
src/
├─ app/
│  ├─ api/graphql/route.ts   # Hono + Yoga handler
│  ├─ client-component.tsx   # Example client component using @urql/next
│  └─ page.tsx               # RSC querying GraphQL via getClient()
├─ graphql/                  # Generated documents & helpers (do not edit manually)
├─ lib/urql.ts               # registerUrql() server-side client
└─ providers/urql.tsx        # Suspense-ready UrqlProvider for client tree
```

## Getting Started

```bash
# install
pnpm install        # or npm install / yarn install

# run the dev server
pnpm dev            # exposes http://localhost:3000
```

The GraphQL endpoint is available at `http://localhost:3000/api/graphql`. You can send standard POST requests or open Yoga's GraphiQL playground in the browser.

## GraphQL Handler

`src/app/api/graphql/route.ts`

```ts
import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import SchemaBuilder from "@pothos/core";

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: { name: t.arg.string() },
      resolve: (parent, { name }) => `hello, ${name || "World"}`,
    }),
  }),
});

const yoga = createYoga({
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { fetch, Request, ReadableStream, Response },
  schema: builder.toSchema(),
});

const app = new Hono()
  .basePath("/api")
  .mount("/graphql", yoga, { replaceRequest: (req) => req });

export const GET = app.fetch;
export const POST = app.fetch;
```

## Querying from React

- `src/app/page.tsx` shows an async Server Component that runs a URQL query via `registerUrql()` and streams a fallback while waiting for the client component.
- `src/app/client-component.tsx` is a Client Component that uses `useQuery` from `@urql/next`.

```tsx
const helloQuery = graphql(`
  query HelloFromClientComponent {
    hello(name: "from client component")
  }
`);

export const ClientComponent = () => {
  const [result] = useQuery({ query: helloQuery });
  return <div>ClientComponent: {result.data?.hello}</div>;
};
```

## GraphQL Code Generation

This project ships with GraphQL Code Generator pre-configured:

```bash
pnpm codegen         # one-off run (server must be running so Yoga can serve the schema)
pnpm codegen:watch   # keep documents and types in sync during development
```

Generated artifacts live in `src/graphql/*` and power the `graphql` tagged template you see in React components.

## Customizing the Schema

Add fields, mutations, or subscriptions directly in the Route Handler with Pothos:

```ts
builder.mutationType({
  fields: (t) => ({
    updatePostStatus: t.boolean({
      args: {
        id: t.arg.int({ required: true }),
        status: t.arg.string({ required: true }),
      },
      resolve: async (_, { id, status }) => {
        // implement your update logic here
        return true;
      },
    }),
  }),
});
```

After editing, restart the dev server (if needed) and re-run `pnpm codegen` to refresh typed documents.

## Deployment

- Works on both Node and Edge runtimes thanks to Yoga's Fetch API and Hono's adapters.
- Deploy straight to Vercel: the Route Handler exports (`GET`/`POST`) automatically become the `/api/graphql` endpoint.

## License

MIT
