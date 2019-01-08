import Vue from "vue";
import Router from "vue-router";
import Monitor from "./views/hn/Monitor";

import About from "@/views/About";
import Error404 from "@/views/error-page/404";

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
    path: "/404",
    name: "E404",
    component: Error404
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
  },
  {
    path: "/system/dict",
    name: "Dict",
    component: () => import("@/views/system/dict")
  },
  {
    path: "/system/unit",
    name: "Unit",
    component: () => import("@/views/system/unit")
  },
  {
    path: "/iot/model",
    name: "Model",
    component: () => import("@/views/iot/model")
  },
  {
    path: "/iot/area",
    name: "Area",
    component: () => import("@/views/iot/area")
  },
  {
    path: "/ticket/config",
    name: "TicketType",
    component: () => import("@/views/ticket/ticket_type")
  },
  {
    path: "/ticket/field/:actionId",
    name: "TicketField",
    component: () => import("@/views/ticket/ticket_action_field")
  },
  {
    path: "/kf/event",
    name: "Event",
    component: () => import("@/views/work-order/event")
  },
  {
    path: "/kf/ticket",
    name: "Ticket",
    component: () => import("@/views/work-order/ticket")
  },
  {
    path: "/iot/station",
    name: "Station",
    component: () => import("@/views/iot/station")
  },
  {
    path: "/iot/sensor/:station/:device",
    name: "DeviceSensor",
    component: () => import("@/views/iot/station/sensor")
  },
  {
    path: "/iot/sensor/:station",
    name: "StationSensor",
    component: () => import("@/views/iot/station/sensor")
  }
];

export default new Router({
  routes
});
