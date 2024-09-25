import {
  ApolloClient,
  ApolloLink,
  DefaultContext,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  RequestHandler,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { useUserStore } from "../stores/userStore";

loadErrorMessages();
loadDevMessages();

async function refreshToken(client: ApolloClient<NormalizedCacheObject>) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation RefreshToken {
          refreshToken
        }
      `,
    });
    const newAccessToken = data?.refreshToken;
    if (!newAccessToken) {
      throw new Error("New access token not received");
    }
    return `Bearer ${newAccessToken}`;
  } catch (err) {
    console.log(err);
    throw new Error("Error getting new access token");
  }
}

let retryCount = 0;
const maxRetry = 3;

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:3000/graphql",
    shouldRetry: () => {
      return true;
    },
    connectionParams: {
      //   Authentication: `Bearer ${localStorage.getItem("access_token")}`,
      authToken: localStorage.getItem("access_token"),
    },
  })
);

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (!graphQLErrors) return;
  for (const err of graphQLErrors) {
    if (err.extensions?.code === "UNAUTHENTICATED" && retryCount < maxRetry) {
      retryCount++;
      return new Observable((observer) => {
        refreshToken(client)
          .then((token) => {
            operation.setContext(
              (previousContext: Partial<DefaultContext>) => ({
                headers: {
                  ...previousContext.headers,
                  authorization: token,
                },
              })
            );
            const forward$ = forward(operation);
            forward$.subscribe(observer);
          })
          .catch((error) => observer.error(error));
      });
    }

    if (err.message === "Refresh token not found") {
      console.log("Refresh token not found");
      useUserStore.setState({
        id: undefined,
        fullname: "",
        email: "",
      });
    }
  }
});

const uploadLink = createUploadLink({
  uri: "http://localhost:3000/graphql",
  credentials: "include",
  headers: {
    "apollo-require-preflight": "true",
  },
});

const splitLink = split(
  // Split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink as unknown as RequestHandler,
  ApolloLink.from([errorLink as unknown as ApolloLink, uploadLink])
);

export const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  link: splitLink,
});
