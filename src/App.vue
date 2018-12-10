<template>
  <div id="app">
    <f-header></f-header>
    <div class="container">
      <f-slider></f-slider>
      <div class="main">
        <f-tab></f-tab>
      </div>
    </div>
    <f-footer></f-footer>
  </div>
</template>
<script>
import FHeader from "@/components/layout/FHeader";
import FSlider from "@/components/layout/FSlider";
import FFooter from "@/components/layout/FFooter";
import FTab from "@/components/layout/FTab";
export default {
  components: {
    FHeader,
    FSlider,
    FFooter,
    FTab
  },
  mounted() {}
};
</script>

<style lang="less">
</style>
