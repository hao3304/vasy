<template>
    <div class="f-page">
        <Pagination :total="total" displayMsg="显示 {from} 到 {to}，共 {total} 记录" :pageSize="limit" :pageNumber="page" :layout="layout" @pageChange="onPageChange">
            <template slot-scope="scope">
                <div style="margin: 0 5px;">第 <InputNumber size="small" :max="Math.round(total/limit)" :min="1" v-model="page" style="width: 50px;text-align: center" /> 页，共 {{Math.round(total/limit)}} 页 </div>
            </template>
        </Pagination>
    </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    }
  },
  name: "FPage",
  watch: {
    limit() {
      this.page = 1;
    }
  },
  data() {
    return {
      layout: [
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
      page: 1,
      limit: 20
    };
  },
  methods: {
    onPageChange(event) {
      this.limit = event.pageSize;
      this.page = event.pageNumber;
      this.$emit("on-page-change", event);
    },
    reset() {
      this.limit = 20;
      this.page = 1;
    }
  }
};
</script>

<style lang="less">
.f-page {
  border-top: 1px solid #dcdee2;
}
</style>
