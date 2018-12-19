<template>
    <div class="f-header">

    </div>
</template>

<script>
export default {
  name: "FHeader"
};
</script>

<style lang="less">
@import "~@/styles/theme.less";

.f-header {
  height: 50px;
  background-color: @HeaderBg;
  background-image: linear-gradient(143deg, #2945cb 20%, #0072ca 81%, #3a9dff);
}
</style>
