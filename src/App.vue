<template>
  <div id="app">
    <template v-if="token">
      <f-header></f-header>
      <div class="container">
        <f-slider></f-slider>
        <div class="main">
          <f-tab></f-tab>
          <right-monitor></right-monitor>
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

import RightMonitor from "@/views/hn/Monitor/rightMonitor";

import Login from "./Login";

import { mapMutations, mapState } from "vuex";
export default {
  components: {
    FHeader,
    FSlider,
    FFooter,
    FTab,
    Login,
    RightMonitor
  },
  computed: {
    ...mapState(["token"])
  },
  methods: {
    ...mapMutations("app", ["init"])
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
</style>
