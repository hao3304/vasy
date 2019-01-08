<template>
    <div class="f-panel">
        <div class="f-panel__header" v-show="header">
            <slot name="header"></slot>
        </div>
        <div class="f-panel__body"  ref="panel_body">
            <slot name="body" :bodyHeight="bodyHeight"></slot>
        </div>
        <div class="f-panel__footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
import base from "@/mixins/base";
export default {
  props: {
    header: {
      type: Boolean,
      default: true
    }
  },
  name: "FPanel",
  mixins: [base],
  data() {
    return {
      bodyHeight: 0,
      timer: null
    };
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.bodyHeight = this.$refs.panel_body
          ? this.$refs.panel_body.clientHeight
          : 0;
      });
    }
  },
  mounted() {
    this.init();
    if (this.timer) clearInterval();
    this.timer = setInterval(() => {
      this.init();
    }, 20);
  }
};
</script>

<style lang="less">
.f-panel {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    padding: 5px;
    border-bottom: 1px solid #ccc;
  }
  &__body {
    flex: 1;
    overflow: hidden;
  }
  &__footer {
  }
}
</style>
