import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import VueApollo from "vue-apollo";
import Cookies from "js-cookie";
import store from "./store";
import Vue from "vue";
import { Notice } from "iview";
import { GetRoot } from "@/services/axios";

const path = GetRoot();

const iotLink = new HttpLink({
  uri: path + "/jxrq/iot"
});

const gasLink = new HttpLink({
  uri: path + "/jxrq/gas"
});

const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      "X-AUTH-TOKEN": Cookies.get("token")
    }
  });
  return forward(operation);
});

const error = new onError(({ networkError, operation, forward }) => {
  if (networkError) {
    if (networkError.result.code && networkError.result.code == "403") {
      store.commit("LOGOUT");
    } else {
      Notice.error({
        title: networkError.message,
        desc: networkError.result.errors[0].message
      });
    }
  }
  return forward(operation);
});
export const iotClient = new ApolloClient({
  link: error.concat(middlewareLink.concat(iotLink)),
  cache: new InMemoryCache(),
  connectToDevTools: true
});

export const gasClient = new ApolloClient({
  link: error.concat(middlewareLink.concat(gasLink)),
  cache: new InMemoryCache(),
  connectToDevTools: true
});

// export const wsClient = new ApolloClient({
//   link: error.concat(middlewareLink.concat(wsLink)),
//   cache: new InMemoryCache(),
//   connectToDevTools: true
// });

Vue.use(VueApollo);
export default new VueApollo({
  clients: {
    gas: gasClient,
    iot: iotClient
    // ws: wsClient
  },
  defaultOptions: {
    $query: {
      fetchPolicy: "network-only"
    }
  },
  defaultClient: iotClient
});
