import Vue from "vue";
import Router from "vue-router";
import Monitor from "./views/hn/Monitor";

import About from "@/views/About";

Vue.use(Router);

export const routes = [
  {
    path: "/views/hn/monitor",
    name: "Monitor",
    component: Monitor
  },
  {
    path: "/about",
    name: "About",
    component: About
  }
];

export default new Router({
  routes
});
