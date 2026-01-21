import { graphql } from "@/graphql";
import { ClientComponent } from "./client-component";
import { getClient } from "@/lib/urql";
import { Suspense } from "react";

// You may need this depending on your use case
// export const dynamic = "force-dynamic";

const helloQuery = graphql(`
  query Hello {
    hello(name: "from server component")
  }
`);

export default async function Home() {
  const result = await getClient().query(helloQuery, {}).toPromise();
  if (result.error) {
    return <div>Error: {result.error.message}</div>;
  }

  return (
    <div>
      <div>Hello: {result.data?.hello}</div>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientComponent />
      </Suspense>
    </div>
  );
}
