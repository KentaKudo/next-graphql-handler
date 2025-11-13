import "server-only";
import { cacheExchange, createClient, fetchExchange } from "@urql/core";
import { registerUrql } from "@urql/next/rsc";

const makeClient = () =>
  createClient({
    url: "http://localhost:3000/api/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });

export const { getClient } = registerUrql(makeClient);
