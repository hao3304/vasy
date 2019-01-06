export default {
  namespaced: true,
  state: {
    right: false,
    rightActive: null,
    rightMenu: [
      {
        id: 1,
        name: "综合查询",
        icon: "ivu-icon ivu-icon-md-search"
      },
      {
        id: 2,
        name: "监控中心",
        icon: "ivu-icon ivu-icon-md-analytics"
      },
      {
        id: 3,
        name: "站点列表",
        icon: "iconfont icon-shoucang1"
      }
    ],
    stations: [],
    monitorStation: ""
  },
  mutations: {
    set_right_active(state, payload) {
      state.rightActive = payload;
    },
    set_stations(state, payload) {
      state.stations = payload;
    },
    set_monitor_station(state, payload) {
      state.monitorStation = payload;
    },
    set_right(state, payload) {
      state.right = payload;
    }
  }
};
