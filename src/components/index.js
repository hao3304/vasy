import Vue from "vue";
import iconfont from "./iconfont";
import FFilter from "./FFilter";
import FPanel from "./crud/FPanel";
import FPage from "./FPage";
import FLayoutPanel from "./layout/FLayoutPanel";
import TwoV from "./layout/FLayoutPanel/TowVertical";
import XWrapper from "./xWrapper";
import iconButton from "./iconButton";

Vue.component("FFilter", FFilter);
Vue.component("Iconfont", iconfont);
Vue.component("FPanel", FPanel);
Vue.component("FPage", FPage);
Vue.component("FLayoutPanel", FLayoutPanel);
Vue.component("TwoH", FLayoutPanel);
Vue.component("TwoV", TwoV);
Vue.component("XWrapper", XWrapper);
Vue.component("IconButton", iconButton);
