import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "vx-easyui/dist/themes/gray/easyui.css";
import "vx-easyui/dist/themes/icon.css";
import "vx-easyui/dist/themes/vue.css";
import EasyUI from "vx-easyui";
import "@/styles/index.less";
Vue.use(EasyUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
