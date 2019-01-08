export default {
  namespaced: true,
  state: {
    module: [
      {
        id: "1",
        text: "热网管理",
        iconCls: "icon-wang",
        children: [
          {
            id: "1-1",
            text: "热网管理",
            state: "open",
            iconCls: "iconfont icon-wang",
            children: [
              {
                id: "1-2",
                text: "换热站",
                path: "About"
              },
              {
                id: "1-4",
                text: "远程管理",
                path: "building"
              }
            ]
          }
        ]
      },
      {
        id: "2",
        text: "集抄管理",
        iconCls: "icon-iconfontchangemeter-copy",
        children: []
      },
      {
        id: "3",
        text: "客服管理",
        iconCls: " icon-kefu",
        children: [
          {
            id: "3-3",
            text: "客服管理",
            iconCls: "iconfont icon-kefu",
            state: "open",
            children: [
              {
                id: "3-1",
                text: "热线记录",
                iconCls: "iconfont icon-yichangshijianliebiaocopy",
                path: "Event"
              },
              {
                id: "3-2",
                text: "工单管理",
                iconCls: "iconfont icon-order",
                path: "Ticket"
              }
            ]
          }
        ]
      },
      {
        id: "4",
        text: "巡检管理",
        iconCls: "icon-xunjianguiji",
        children: []
      },
      {
        id: "5",
        text: "系统配置",
        iconCls: "icon-xitongpeizhi",
        children: [
          {
            id: 666,
            text: "平台监控",
            iconCls: "iconfont icon-jiankong",
            state: "open",
            children: [
              {
                id: 667,
                text: "队列管理",
                path: "Queue"
              },
              {
                id: 668,
                text: "服务管理",
                path: "Building"
              },
              {
                id: 669,
                text: "作业管理",
                path: "Building"
              }
            ]
          },
          {
            id: 670,
            text: "物联管理",
            iconCls: "iconfont icon-wulianwang",
            open: false,
            children: [
              {
                id: 671,
                text: "模板管理",
                path: "Model"
              },
              {
                id: 672,
                text: "站点管理",
                path: "Station"
              },
              // {
              //   id: 676,
              //   text: "视频区域",
              //   path: "Video"
              // },
              {
                id: 673,
                text: "权限管理",
                path: "Building"
              },
              {
                id: 675,
                text: "区域管理",
                path: "Area"
              }
            ]
          },
          {
            id: 684,
            text: "系统管理",
            iconCls: "iconfont icon-yonghuguanli",
            children: [
              {
                id: 686,
                text: "部门管理",
                path: "Dep"
              },
              {
                id: 687,
                text: "用户管理",
                path: "User"
              },
              {
                id: 688,
                text: "角色管理",
                path: "Role"
              },
              {
                id: 689,
                text: "权限管理",
                path: "Building"
              },
              {
                id: 680,
                text: "字典管理",
                path: "Dict"
              },
              {
                id: 681,
                text: "数据类型",
                path: "Unit"
              }
            ]
          },
          {
            id: 780,
            text: "业务管理",
            iconCls: "iconfont icon-liuchengmoxing",
            children: [
              {
                id: 781,
                text: "工单流程",
                path: "TicketType"
              }
            ]
          },
          {
            id: 880,
            text: "日志审计",
            iconCls: "iconfont icon-rizhi",
            children: [
              {
                id: 881,
                text: "登录日志",
                path: "Building"
              },
              {
                id: 882,
                text: "对象操作",
                path: "Building"
              },
              {
                id: 883,
                text: "菜单访问",
                path: "Building"
              }
            ]
          }
        ]
      }
    ],
    selectModule: "1",
    selectModuleTitle: "",
    sliderMenu: [],
    sliderActive: {},
    sliderExpand: true,
    tabs: [],
    tabIndex: 0,
    isActiveRouter: true
  },
  mutations: {
    set_module(state, payload) {
      state.selectModule = payload;
      const target = state.module.find(m => m.id == state.selectModule);
      state.sliderMenu = [];
      setTimeout(() => {
        state.sliderMenu = target.children;
        state.selectModuleTitle = target.text;
      }, 1);
    },
    set_slider_active(state, payload) {
      state.sliderActive = payload;
    },
    set_mode(state, payload) {
      state.mode = payload;
    },
    set_slider_expand(state, payload) {
      state.sliderExpand = payload;
    },
    add_tab(state, payload) {
      const index = state.tabs.findIndex(t => t.text == payload.text);
      if (index == -1) {
        state.tabs.push(payload);
        state.tabIndex = state.tabs.length;
      } else {
        state.tabIndex = index + 1;
      }
    },
    remove_tab(state, payload) {
      state.tabs = state.tabs.filter(t => t.text != payload.text);
    },
    set_tab_index(state, payload) {
      state.tabIndex = payload;
    },
    init() {
      this.commit("app/set_module", 1);
    }
  },
  actions: {
    refresh_router({ state }) {
      state.isActiveRouter = false;
      setTimeout(() => {
        state.isActiveRouter = true;
      }, 100);
    }
  }
};
