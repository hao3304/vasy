import Vue from "vue";
import App from "./App.vue";
import Views from "./views/Index";
import router from "./router";
import store from "./store";
import "vx-easyui/dist/themes/gray/easyui.css";
import "vx-easyui/dist/themes/icon.css";
import "vx-easyui/dist/themes/vue.css";
import EasyUI from "vx-easyui";

import "@/styles/index.less";
import "iview/dist/styles/iview.css";
import "@/styles/theme.less";
import "./components";
import iView from "iview";
Vue.use(iView);
Vue.use(EasyUI);
Vue.config.productionTip = false;

export default new Vue({
  router,
  store,
  render(h) {
    if (this.$route.name) {
      return h(Views);
    } else {
      return h(App);
    }
  }
}).$mount("#app");
