# 🧩 Next GraphQL Handler

A minimal Next.js 16 project that keeps the entire GraphQL stack inside a Route Handler.  
GraphQL Yoga handles execution, Pothos builds a fully type-safe schema, and URQL powers both RSC data fetching and client components so the frontend and backend live in one repo.

## Highlights

- Next.js Route Handler = no separate API server or Lambdas to manage
- GraphQL Yoga edge-ready handler with `GET`/`POST`/`OPTIONS` exports for `/api/graphql`
- Pothos GraphQL schema with full TypeScript type safety
- URQL set up for both server components (`getClient()`) and client components
- GraphQL Code Generator preset that keeps `src/graphql/*` in sync with your schema

## Project Layout

```
schema.graphql                  # Generated SDL snapshot
codegen.ts                      # GraphQL Code Generator config
src/
├─ app/
│  ├─ api/graphql/
│  │  ├─ route.ts              # GraphQL Yoga handler
│  │  └─ schema.ts             # Pothos schema definition
│  ├─ client-component.tsx     # Example client component using @urql/next
│  └─ page.tsx                 # RSC querying GraphQL via getClient()
├─ graphql/                    # Generated documents & helpers (do not edit manually)
├─ lib/urql.ts                 # registerUrql() server-side client
└─ providers/urql.tsx          # Suspense-ready UrqlProvider for client tree
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

The GraphQL handler is split into two files for better organization:

**`src/app/api/graphql/schema.ts`** - Pothos schema definition:

```ts
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

export const schema = builder.toSchema();
```

**`src/app/api/graphql/route.ts`** - Next.js Route Handler:

```ts
import { createYoga } from "graphql-yoga";
import { schema } from "./schema";

const { handleRequest } = createYoga({
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  schema,
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
```

## Querying from React

### Server Component (`src/app/page.tsx`)

Uses `getClient()` from URQL's RSC support to fetch data on the server:

```tsx
import { graphql } from "@/graphql";
import { getClient } from "@/lib/urql";

const helloQuery = graphql(`
  query Hello {
    hello(name: "from server component")
  }
`);

export default async function Home() {
  const result = await getClient().query(helloQuery, {});
  if (result.error) {
    return <div>Error: {result.error.message}</div>;
  }

  return <div>Hello: {result.data?.hello}</div>;
}
```

### Client Component (`src/app/client-component.tsx`)

Uses `useQuery` from `@urql/next` for client-side data fetching:

```tsx
"use client";

import { graphql } from "@/graphql";
import { useQuery } from "@urql/next";

const helloQuery = graphql(`
  query HelloFromClientComponent {
    hello(name: "from client component")
  }
`);

export const ClientComponent = () => {
  const [result] = useQuery({ query: helloQuery });
  if (result.error) {
    return <div>Error: {result.error.message}</div>;
  }

  return <div>ClientComponent: {result.data?.hello}</div>;
};
```

## GraphQL Code Generation

This project ships with GraphQL Code Generator pre-configured. The codegen imports your Pothos schema directly from `src/app/api/graphql/schema.ts`, so **no server needs to be running**:

```bash
pnpm codegen         # one-off run
pnpm codegen:watch   # keep documents and types in sync during development
```

Generated artifacts live in `src/graphql/*` and power the `graphql` tagged template you see in React components. The schema is also exported as SDL to `schema.graphql` in the project root.

## Customizing the Schema

Add fields, mutations, or subscriptions in `src/app/api/graphql/schema.ts` with Pothos:

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

After editing, run `pnpm codegen` to refresh typed documents (or use `pnpm codegen:watch` during development).

## Deployment

- Works on both Node and Edge runtimes thanks to Yoga's Fetch API compatibility.
- Deploy straight to Vercel: the Route Handler exports (`GET`/`POST`/`OPTIONS`) automatically become the `/api/graphql` endpoint.
- The GraphQL playground (GraphiQL) is available in development mode for easy testing.

## License

MIT
