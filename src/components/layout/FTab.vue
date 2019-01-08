<template>
    <div class="f-tab">
        <Tabs ref="tabs" style="width: 100%;" @tabClose="onTabClose" @tabSelect="onTabSelect"  :scrollable="true" :style="{height: windowHeight - 79 + 'px'}">
            <TabPanel  title="首页" iconCls="fa fa-home">
                <iframe :src="getPath('Monitor')" style="width: 100%;" :style="{height: windowHeight - 116 + 'px'}" frameborder="0"></iframe>
            </TabPanel>
            <TabPanel v-for="(tab, index) in tabs" :closable="true" :target="tab" :title="tab.text" :key="index" iconCls="fa fa-file-text-o">
                <iframe :src="getSrc(tab.path)" style="width: 100%;" :style="{height: windowHeight - 116 + 'px'}" frameborder="0"></iframe>
            </TabPanel>
        </Tabs>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { routes } from "@/router";
export default {
  name: "FTab",
  computed: {
    ...mapState(["windowHeight"]),
    ...mapState("app", ["tabs", "tabIndex"])
  },
  watch: {
    tabIndex() {
      this.$nextTick(() => {
        this.$refs.tabs.select(this.tabIndex);
      });
    }
  },
  methods: {
    ...mapMutations("app", ["remove_tab", "set_tab_index"]),
    getPath(path) {
      const route = routes.find(route => route.name == path);
      return window.location.origin + "#" + (route ? route.path : "/404");
    },
    getSrc(path) {
      return window.location.origin + "#" + path;
    },
    onTabClose(tab) {
      this.remove_tab(tab.$attrs.target);
      this.set_tab_index(this.tabs.length);
    },
    onTabSelect(panel) {
      const index = this.$refs.tabs.getPanelIndex(panel);
      this.set_tab_index(index);
    },
    onRefresh() {
      const panel = this.$refs.tabs.getSelectedPanel();
      const iframe = $(panel.$el).find("iframe");
      const src = iframe.attr("src");
      iframe.attr("src", "");
      this.$nextTick(() => {
        iframe.attr("src", src);
      });
    }
  },
  mounted() {
    eventBus.$on("refresh", () => {
      this.onRefresh();
    });
  }
};
</script>

<style lang="less">
.f-tab {
  .panel-body {
    overflow: hidden;
  }

  .tabs-container {
    padding-left: 4px;
  }

  .tabs {
    padding-left: 0;
    .tabs-icon {
      margin-top: -6px;
    }
  }

  .tabs-header {
    border: none;
  }
}
</style>
