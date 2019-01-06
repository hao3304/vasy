import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import VueApollo from "vue-apollo";
import store from "./store";
import Vue from "vue";
import Cookies from "js-cookie";
import { Notice } from "iview";

const iotLink = new HttpLink({
  uri: process.env.VUE_APP_BOOT + "/hsn/iot"
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
      store.commit("logout");
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

Vue.use(VueApollo);
export default new VueApollo({
  defaultClient: iotClient
});
