<template>
    <div class="page-model">
        <two-v>
            <x-wrapper
                    slot="top"
                    style="padding-bottom: 0"
                    title="远传模版"
                    service="model"
                    :model="model"
                    :columns="columns"
                    :rules="rules"
                    :filter="filter"
                    ref="wrapper"
                    @on-row-click="onRowClick"
                    @refresh="onRefresh"
            >
                <div slot="dialog" slot-scope="{ model }">
                    <FormItem :label="modelModel.name" prop="name">
                        <Input v-model="model.name" :placeholder="'请输入'+ modelModel.name"  />
                    </FormItem>
                    <FormItem :label="modelModel.type" prop="type">
                        <Select v-model="model.type" :placeholder="'请选择'+ modelModel.type"  >
                            <Option v-for="m in modelType" :label="m.name" :value="m.id" :key="m.id"></Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="modelModel.status">
                        <RadioGroup v-model.number="model.status">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">禁用</Radio>
                        </RadioGroup>
                    </FormItem>
                </div>
                <Button slot="buttons" style="margin-left: 10px" @click="onAddChild"  icon="md-add"  :disabled="!selectData">添加通道</Button>

            </x-wrapper>
            <model-channel slot="bottom" ref="dictItem"></model-channel>
        </two-v>

    </div>
</template>

<script>
import types from "@/types";
const { modelModel, newModel } = types;
import Vue from "vue";
import modelChannel from "./modelChannel";
import { mapState } from "vuex";
export default {
  name: "Dict",
  components: {
    modelChannel
  },
  computed: {
    ...mapState("common", ["modelType"]),
    ...mapState(["windowHeight"])
  },
  data() {
    return {
      modelModel,
      selectData: null,
      columns: [
        {
          width: 60,
          type: "selection"
        },
        {
          title: modelModel.name,
          key: "name",
          sortable: "custom",
          width: 180
        },
        {
          title: modelModel.type,
          key: "type",
          sortable: "custom",
          width: 150,
          render: (h, { row }) => {
            const type = this.modelType.find(t => t.id == row.type);

            return h("div", {}, type ? type.name : "");
          }
        },
        {
          title: modelModel.status,
          key: "status",
          sortable: "custom",
          width: 120,
          render: (h, { row }) => {
            return h(
              "Tag",
              {
                props: {
                  color: row.status == 1 ? "success" : "default",
                  size: "small",
                  type: "border"
                },
                style: {
                  fontSize: "12px"
                }
              },
              row.status == 1 ? "启用中" : "已禁用"
            );
          }
        },
        {
          title: "创建时间",
          key: "created",
          sortable: "custom",
          width: 120,
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.created * 1000));
          }
        },
        {
          title: "更新时间",
          key: "changed",
          minWidth: 120,
          sortable: "custom",
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.changed * 1000));
          }
        },
        {
          title: "操作",
          width: 150,
          align: "center",
          render: (h, { row }) => {
            return h("div", [
              h(
                "iconButton",
                {
                  props: {
                    icon: "iconfont icon-bianji",
                    type: "primary",
                    tooltip: "编辑",
                    placement: "left"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => this.$refs.wrapper.onEdit(row)
                  }
                },
                "编辑"
              ),
              h(
                "iconButton",
                {
                  props: {
                    type: "error",
                    icon: "iconfont icon-shanchu",
                    tooltip: "删除",
                    placement: "right"
                  },
                  on: {
                    click: () =>
                      this.$refs.wrapper.onDelete(
                        row.id,
                        `确定要删除模版【${row.name}】吗？`
                      )
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      model: newModel,
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        type: [
          { required: true, type: "number", message: "必选", trigger: "change" }
        ]
      },
      filter: [
        {
          type: "input",
          name: modelModel.name,
          field: "name",
          placeholder: "请输入名称模糊查询"
        }
      ]
    };
  },
  methods: {
    onRowClick(row) {
      this.$refs["dictItem"].setParent(row);
      this.selectData = row;
    },
    onAddChild() {
      this.$refs["dictItem"].onAdd();
    },
    onRefresh() {
      this.$refs["dictItem"].reset();
      this.selectData = null;
    }
  }
};
</script>

<style lang="less">
.page-model {
  height: 100%;
}
</style>
