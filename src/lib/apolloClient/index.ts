import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "https://api.gr.axra.app/v1/graphql", 
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("[graphQLErrors]", graphQLErrors);
    graphQLErrors.forEach(({ extensions }) => {
      if (extensions?.code === "invalid-jwt") {
        localStorage.removeItem("token");
        alert("Session Expired, Please Sign In With Your Credentials Again");
      }
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    alert("Network connection problem");
  }
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const createApolloClient = () =>
  new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });
