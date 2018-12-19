import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    windowHeight: document.documentElement.clientHeight,
    windowWidth: document.documentElement.clientWidth
  },
  mutations: {
    set_token(state, payload) {
      state.token = payload;
    },
    logout(state, payload) {
      state.token = payload;
    },
    set_window_height(state, payload) {
      state.windowHeight = payload;
    },
    set_window_width(state, payload) {
      state.windowWidth = payload;
    }
  },
  modules: {}
});
