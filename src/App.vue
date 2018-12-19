<template>
  <div id="app">
    <template v-if="token">
      <f-header></f-header>
      <div class="container">
        <f-slider></f-slider>
        <div class="main">
          <f-tab></f-tab>
        </div>
      </div>
      <f-footer></f-footer>
    </template>
    <Login v-else></Login>
  </div>
</template>
<script>
import FHeader from "@/components/layout/FHeader";
import FSlider from "@/components/layout/FSlider";
import FFooter from "@/components/layout/FFooter";
import FTab from "@/components/layout/FTab";

import Login from "./Login";

import { mapMutations, mapState } from "vuex";
export default {
  components: {
    FHeader,
    FSlider,
    FFooter,
    FTab,
    Login
  },
  computed: {
    ...mapState(["token"])
  },
  methods: {
    ...mapMutations(["set_window_height", "set_window_width"])
  },
  mounted() {
    window.onresize = () => {
      this.set_window_height(window.document.documentElement.clientHeight);
      this.set_window_width(window.document.documentElement.clientWidth);
    };
  }
};
</script>

<style lang="less">
</style>
