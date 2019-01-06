<template>
    <div>
        <Modal v-model="dialog" width="600px" title="数据列管理" @on-ok="onOk" >
            <Row>
                <i-col :span="8" v-for="column in columns" :key="column.key" v-if="column.key">
                    <Checkbox v-model="map[column.key]" style="margin-bottom: 5px;margin-left: 15px;" >{{column.title}}</Checkbox>
                </i-col>
            </Row>
        </Modal>
    </div>
</template>
<script>
export default {
  props: {
    name: String,
    visible: Boolean,
    columns: {
      default: []
    }
  },
  name: "xColumn",
  data() {
    return {
      dialog: this.visible,
      map: {}
    };
  },
  watch: {
    visible() {
      this.dialog = this.visible;
    },
    dialog() {
      this.$emit("update:visible", this.dialog);
      if (this.dialog) {
        this.initMap();
      }
    }
  },
  methods: {
    initMap() {
      const local = this.$ls.get(this.name, null);
      this.columns.forEach(column => {
        if (local) {
          this.$set(
            this.map,
            column.key,
            local.findIndex(l => l == column.key) > -1
          );
        } else {
          this.$set(this.map, column.key, true);
        }
      });
    },
    onOk() {
      const columns = [];
      this.columns.forEach(column => {
        if (this.map[column.key]) {
          columns.push(column);
        }
      });
      this.$ls.set(this.name, columns.map(c => c.key));
      this.$emit("on-select", columns);
    }
  }
};
</script>

<style>
</style>
