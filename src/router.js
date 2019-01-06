import Vue from "vue";
import Router from "vue-router";
import Monitor from "./views/hn/Monitor";

import About from "@/views/About";
import User from "@/views/system/user";

Vue.use(Router);

export const routes = [
  {
    path: "/hn/monitor",
    name: "Monitor",
    component: Monitor
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/system/user",
    name: "User",
    component: User
  }
];

export default new Router({
  routes
});
