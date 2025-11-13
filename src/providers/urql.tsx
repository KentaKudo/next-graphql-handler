"use client";

import { useMemo } from "react";
import {
  UrqlProvider as NextUrqlProvider,
  ssrExchange,
  cacheExchange,
  fetchExchange,
  createClient,
} from "@urql/next";

interface Props {
  url: string;
  children: React.ReactNode;
}

export const UrqlProvider = ({ url, children }: Props) => {
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== "undefined",
    });
    const client = createClient({
      url,
      exchanges: [cacheExchange, ssr, fetchExchange],
      suspense: true,
    });

    return [client, ssr];
  }, [url]);

  return (
    <NextUrqlProvider client={client} ssr={ssr}>
      {children}
    </NextUrqlProvider>
  );
};
