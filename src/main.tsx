import { ApolloProvider } from "@apollo/client";
import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { client } from "./libs/apolloClient.ts";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <MantineProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
    </ApolloProvider>
  </StrictMode>
);
