import { schema } from "./src/app/api/graphql/schema";
import type { CodegenConfig } from "@graphql-codegen/cli";
import { printSchema } from "graphql";

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ["./**/*.{ts,tsx}"],
  ignoreNoDocuments: true,
  generates: {
    "./src/graphql/": { preset: "client" },
    "./schema.graphql": { plugins: ["schema-ast"] },
  },
};

export default config;
