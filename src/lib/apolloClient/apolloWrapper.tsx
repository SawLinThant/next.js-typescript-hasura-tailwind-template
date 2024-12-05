"use client";

import { ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";
import { createApolloClient } from "@/lib/apolloClient";

const client = createApolloClient();

export default function ApolloProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
