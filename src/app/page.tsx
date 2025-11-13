import { graphql } from "@/graphql";
import { cacheExchange, createClient, fetchExchange } from "@urql/core";
import { registerUrql } from "@urql/next/rsc";

const makeClient = () => {
  return createClient({
    url: "http://localhost:3000/api/graphql",
    exchanges: [cacheExchange, fetchExchange],
  });
};

const { getClient } = registerUrql(makeClient);

const helloQuery = graphql(`
  query Hello {
    hello
  }
`);

export default async function Home() {
  const result = await getClient().query(helloQuery, {});
  if (result.error) {
    return <div>Error: {result.error.message}</div>;
  }

  return <div>Hello: {result.data?.hello}</div>;
}
