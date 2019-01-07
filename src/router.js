import Vue from "vue";
import Router from "vue-router";
import Monitor from "./views/hn/Monitor";

import About from "@/views/About";

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
    component: () => import("@/views/system/user")
  },
  {
    path: "/system/role",
    name: "Role",
    component: () => import("@/views/system/role")
  }
];

export default new Router({
  routes
});
