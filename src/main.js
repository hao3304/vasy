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
import "@/styles/index.less";
import "iview/dist/styles/iview.css";
import "@/styles/theme.less";
import "./components";
import iView from "iview";
import "./filter";
import "jquery";
import "ztree/css/zTreeStyle/zTreeStyle.css";
import "ztree";
import GeminiScrollbar from "vue-gemini-scrollbar";

Vue.use(GeminiScrollbar);
Vue.use(iView);
Vue.use(EasyUI);
Vue.config.productionTip = false;

window.eventBus = new Vue();

export default new Vue({
  router,
  store,
  apolloProvider,
  render(h) {
    if (this.$route.name) {
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
