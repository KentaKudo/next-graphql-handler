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
