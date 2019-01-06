<template>
    <div class="expand-detail">
        <Row  :gutter="20">
            <i-col v-for="d in data" :key="d.id" :span="6">
                <div class="expand-detail__col">
                    <div class="col__name">
                        {{d.name}}：
                    </div>
                    <div class="col__value">
                        {{d.value | unit(d.unit)}}
                    </div>
                </div>
            </i-col>
        </Row>
        <div style="clear: both;"></div>
    </div>

</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["data"],
  computed: {
    ...mapState("common", ["units"])
  },
  name: "Detail"
};
</script>

<style lang="less">
.expand-detail {
  background-color: #fff;
  padding: 5px 10px;
  border: 1px solid #ddd;
  &__col {
    margin-bottom: 4px;
    display: flex;
    .col__name {
      width: 100px;
      text-align: right;
      background-color: #edfaff;
      padding: 2px;
      color: #555;
    }

    .col__value {
      padding: 2px 5px;
      color: #0f2f6b;
      font-weight: bold;
    }
  }
}
</style>
