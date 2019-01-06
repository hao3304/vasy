<template>
  <div class="page-home">
    <div class="f-panel">
      <div class="f-panel__header">
        <f-filter :list="filter" @on-filter="init" >
          <Button slot="buttons" type="primary" style="margin-left: 40px" icon="md-add" @click="dialog = true">新增</Button>
        </f-filter>
      </div>
      <div class="f-panel__body" ref="panel_body">
        <Table class="f-table" :columns="columns1" :height="height" :data="data1" size="small" border></Table>
      </div>
      <div class="f-panel__footer">
        <Pagination :total="total" displayMsg="显示 {from} 到 {to}，共 {total} 记录" :pageSize="20" :pageNumber="1" :layout="layout1" @pageChange="onPageChange($event)">
          <template slot-scope="scope">
            <div style="margin: 0 5px;">第 <input type="number" value="1" style="width: 40px;text-align: center" /> 页，共 1 页 </div>
          </template>
        </Pagination>
      </div>
    </div>

    <Modal title="xxxx" v-model="dialog"></Modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      layout1: [
        "list",
        "sep",
        "first",
        "prev",
        "sep",
        "tpl",
        "sep",
        "next",
        "last",
        "sep",
        "refresh",
        "info"
      ],
      total: 10,
      columns1: [
        { type: "index", width: 30, align: "center" },
        {
          title: "Name",
          key: "name"
        },
        {
          title: "Age",
          key: "age"
        },
        {
          title: "Address",
          key: "address"
        },
        {
          title: "操作",
          key: "address"
        }
      ],
      data1: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        }
      ],
      height: 0,
      filter: [
        {
          type: "input",
          name: "用户名",
          field: "name",
          placeholder: `请输入用户名模糊查询`
        }
      ],
      dialog: false
    };
  },
  computed: {
    ...mapState(["windowHeight"])
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.height = this.$refs.panel_body.clientHeight;
      });
    }
  },
  mounted() {
    this.init();
    window.onresize = () => {
      this.init();
    };
  }
};
</script>
<style lang="less">
</style>
