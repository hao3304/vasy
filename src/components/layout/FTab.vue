<template>
    <div class="f-tab">
        <Tabs :style="{height: windowHeight - 79 + 'px'}">
            <TabPanel :title="'Tab1'">
                <p>Tab Panel1</p>
            </TabPanel>
            <TabPanel :title="'Tab2'">
                <p>Tab Panel2</p>
            </TabPanel>
            <TabPanel :title="'Tab3'">
                <p>Tab Panel3</p>
            </TabPanel>
            <TabPanel :title="'Help'" :closable="true" iconCls="icon-help">
                <p>This is the help content.</p>
            </TabPanel>
        </Tabs>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "FTab",
  computed: {
    ...mapState(["windowHeight"])
  }
};
</script>

<style lang="less">
</style>
