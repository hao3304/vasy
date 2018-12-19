<template>
    <div class="f-tab">
        <Tabs :style="{height: windowHeight - 79 + 'px'}">
            <TabPanel v-for="tab in tabs" :key="tab.path" :title="tab.name" iconCls="fa fa-file-text-o">
                <iframe :src="getPath(tab.path)" style="width: 100%;" :style="{height: windowHeight - 116 + 'px'}" frameborder="0"></iframe>
            </TabPanel>
            <!--<TabPanel :title="'Help'" :closable="true" iconCls="icon-help">-->
                <!--<p>This is the help content.</p>-->
            <!--</TabPanel>-->
        </Tabs>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "FTab",
  computed: {
    ...mapState(["windowHeight"])
  },
  data() {
    return {
      tabs: [
        {
          name: "测试",
          path: "/views/home"
        }
      ]
    };
  },
  methods: {
    getPath(path) {
      return window.location.origin + "#" + path;
    }
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
