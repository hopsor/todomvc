// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
// import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"

import React from "react";
import ReactDOM from "react-dom";
import TodoMVC from "./components/todo_mvc";
import ApolloClient from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import * as AbsintheSocket from "@absinthe/socket";
import { createAbsintheSocketLink } from "@absinthe/socket-apollo-link";
import { Socket as PhoenixSocket } from "phoenix";

document.addEventListener("DOMContentLoaded", function() {
  const link = createAbsintheSocketLink(AbsintheSocket.create(
    new PhoenixSocket("ws://localhost:4000/socket/websocket?vsn=1.0.0"),
  ));

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
  });

  ReactDOM.render(
    <ApolloProvider client={client}>
      <TodoMVC />
    </ApolloProvider>,
    document.body
  );
});
