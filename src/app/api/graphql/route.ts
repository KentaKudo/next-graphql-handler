import { createYoga } from "graphql-yoga";
import { schema } from "./schema";

interface NextContext {
  params: Promise<Record<string, string>>;
}

const { handleRequest } = createYoga<NextContext>({
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  schema,
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
