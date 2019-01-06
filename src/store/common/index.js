import { iotClient } from "../../apollo";
import { loads } from "@/graphqls/loads.graphql";
import Vue from "@/main";

export default {
  namespaced: true,
  state: {
    areas: [],
    deps: [],
    dicts: [],
    models: [],
    units: [],
    roles: [],
    ticket_types: [],
    me: {},
    ticketMode: [
      {
        id: 1,
        name: "起始"
      },
      {
        id: 2,
        name: "状态"
      },
      {
        id: 3,
        name: "审核"
      },
      {
        id: 100,
        name: "结束"
      }
    ],
    filedType: [
      {
        id: "string",
        name: "字符串"
      },
      {
        id: "int",
        name: "整型"
      },
      {
        id: "float64",
        name: "浮点型"
      },
      {
        id: "date",
        name: "日期"
      },
      {
        id: "dict",
        name: "字典"
      },
      {
        id: "uid",
        name: "用户"
      },
      {
        id: "cuid",
        name: "当前用户"
      },
      {
        id: "now",
        name: "当前时间"
      },
      {
        id: "position",
        name: "定位"
      },
      {
        id: "picture",
        name: "拍照"
      },
      {
        id: "upload",
        name: "上传文件"
      }
    ],
    eventStatus: [
      {
        name: "待办事件",
        id: "pending"
      },
      {
        name: "在办事件",
        id: "working"
      },
      {
        name: "审核中",
        id: "auditing"
      },
      {
        name: "办结事件",
        id: "closed"
      }
    ],
    ticketStatus: [
      {
        name: "待派工单",
        id: "pending"
      },
      {
        name: "已派工单",
        id: "working"
      },
      {
        name: "审核中",
        id: "auditing"
      },
      {
        name: "已完成",
        id: "closed"
      }
    ],
    unitType: [
      {
        name: "开关",
        id: 1
      },
      {
        name: "模拟",
        id: 2
      },
      {
        name: "脉冲",
        id: 3
      },
      {
        name: "报警",
        id: 4
      }
    ]
  },
  actions: {
    init({ commit }) {
      iotClient
        .query({
          query: loads
        })
        .then(rep => {
          commit("SET_INIT", rep);
        })
        .catch(err => {
          console.log(err);
          Vue.$store.commit("logout");
          Vue.$router.push("/login");
        });
    }
  },
  mutations: {
    SET_INIT(state, { data }) {
      state.areas = data.areas;
      state.deps = data.deps;
      state.dicts = data.dicts;
      state.models = data.models;
      state.units = data.units;
      state.me = data.me;
      state.roles = data.roles;
      state.ticket_types = data.ticket_types;
    }
  }
};
