import Vue from "vue";
import App from "./App.vue";
import Views from "./views/Index";
import router from "./router";
import store from "./store";
import Cookies from "js-cookie";
import "vx-easyui/dist/themes/gray/easyui.css";
import "vx-easyui/dist/themes/icon.css";
import "vx-easyui/dist/themes/vue.css";
import EasyUI from "vx-easyui";
import apolloProvider from "./apollo";
import vClickOutside from "v-click-outside";
import "@/styles/index.less";
import "iview/dist/styles/iview.css";
import "@/styles/theme.less";
import "./components";
import "@/components/iview";
import "./filter";
import "jquery";
import "ztree/css/zTreeStyle/zTreeStyle.css";
import "ztree";
import Storage from "vue-ls";
import GeminiScrollbar from "vue-gemini-scrollbar";
Vue.use(Storage, {
  namespace: "hsn__", // key prefix
  name: "ls", // name variable Vue.[ls] or this.[$ls],
  storage: "local" // storage name session, local, memory
});
Vue.use(GeminiScrollbar);
Vue.use(EasyUI);
Vue.use(vClickOutside);
Vue.config.productionTip = false;

window.eventBus = new Vue();

export default new Vue({
  router,
  store,
  apolloProvider,
  render(h) {
    if (window.location.hash != "#/") {
      return h(Views);
    } else {
      return h(App);
    }
  },
  created() {
    const token = Cookies.get("token");
    if (token) {
      store.commit("set_token", token);
      store.dispatch("common/init");
    }
  },
  mounted() {
    window.onresize = () => {
      store.commit(
        "set_window_height",
        window.document.documentElement.clientHeight
      );
      store.commit(
        "set_window_width",
        window.document.documentElement.clientWidth
      );
    };
  }
}).$mount("#app");
