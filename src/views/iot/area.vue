<template>
    <div class="page-area ">

        <two-h>
            <div slot="left">
                <not-find @click="onAdd" v-if="!loading&&tableData.length == 0"></not-find>
                <div id="areaTree" class="ztree" v-else></div>
            </div>
            <x-wrapper
                    slot="right"
                    title="区域"
                    service="area"
                    :columns="columns"
                    :model="model"
                    :rules="rules"
                    :filter="filter"
                    ref="wrapper"
                    :height="windowHeight- 300"
                    :loads="true"
                    :orders="['id']"
                    @on-save="render"
                    @on-update="render"
                    @on-delete="render"
                    @refresh="render"
            >
                <div slot="dialog" slot-scope="{ model }">
                    <FormItem :label="areaModel.name" prop="name">
                        <Input placeholder="请输入区域名称" v-model="model.name" />
                    </FormItem>
                    <FormItem :label="areaModel.parent" prop="parent">
                        <tree-select :treeData="treeData" v-model="model.parent" placeholder="请选择上级区域(默认根目录)"></tree-select>
                    </FormItem>
                    <FormItem :label="areaModel.status">
                        <RadioGroup v-model.number="model.status">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">禁用</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem :label="areaModel.weight" >
                        <InputNumber  style="width: 100%" :min="0" v-model="model.weight" :placeholder="'请输入'+ areaModel.weight"  />
                    </FormItem>
                    <FormItem :label="areaModel.remark">
                        <Input placeholder="请输入备注" type="textarea" v-model="model.remark" />
                    </FormItem>
                </div>
            </x-wrapper>

        </two-h>



    </div>
</template>
<script>
import types from "@/types";
import Vue from "vue";
const areaIcon = require("@/assets/images/icon/area.png");
const allIcon = require("@/assets/images/icon/all.png");
const { newArea, areaModel } = types;
import treeSelect from "@/components/treeSelect";
import areaService from "@/services/area";
import { mapState } from "vuex";
import notFind from "@/components/notFind";
export default {
  data() {
    return {
      dialog: false,
      formLoading: false,
      loading: false,
      columns: [
        {
          width: 40,
          align: "center",
          type: "selection"
        },
        {
          title: areaModel.name,
          key: "name",
          sortable: "custom",
          width: 200
        },
        {
          title: areaModel.parent,
          key: "parent",
          sortable: "custom",
          render: (h, { row }) => {
            const target = this.tableData.find(d => d.id == row.parent);
            return h("div", {}, target ? target.name : "根节点");
          },
          width: 200
        },
        {
          title: areaModel.status,
          key: "status",
          sortable: "custom",
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
          },
          width: 100
        },
        {
          title: areaModel.weight,
          key: "weight",
          sortable: "custom",
          width: 100
        },
        {
          title: areaModel.remark,
          key: "remark",
          width: 150
        },
        {
          title: "创建时间",
          width: 150,
          key: "created",
          sortable: "custom",
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.created * 1000));
          }
        },
        {
          title: "更新时间",
          key: "changed",
          minWidth: 150,
          sortable: "custom",
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.changed * 1000));
          }
        },
        {
          title: "操作",
          width: 100,
          fixed: "right",
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
                        `确定要删除区域【${row.name}】吗？`
                      )
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableData: [],
      treeData: [],
      action: null,
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }]
        // parent: [{ required: true, message: '必选', trigger: 'change' }]
      },
      form: newArea(),
      model: newArea,
      areaModel: areaModel,
      filter: [
        {
          name: "区域名称",
          type: "input",
          field: "name",
          placeholder: "请输入区域名称模糊查询"
        }
      ]
    };
  },
  components: {
    treeSelect,
    notFind
  },
  computed: {
    ...mapState(["windowHeight"])
  },
  methods: {
    onRefresh() {},
    renderTree() {
      const self = this;
      const setting = {
        data: {
          simpleData: {
            enable: true,
            pIdKey: "parent"
          }
        },
        view: {
          showIcon: true
        },
        callback: {
          onClick: (e, type, node) => {
            const list = self.$treeObj.transformToArray(node);
            self.$refs.wrapper.doFilter({
              op: "in",
              field: "id",
              args: list.map(l => l.id)
            });
          }
        }
      };
      this.$treeObj = $.fn.zTree.init($("#areaTree"), setting, this.treeData);
    },
    getTreeData() {
      this.treeData = [
        {
          id: null,
          parent: null,
          name: "根节点",
          icon: allIcon,
          open: true
        }
      ];

      this.tableData.forEach(item => {
        item.icon = areaIcon;
        item.open = true;
        this.treeData.push(item);
      });
    },
    render() {
      this.loading = true;
      areaService
        .findAll({
          size: 999,
          fields: ["*"],
          orders: ["weight"]
        })
        .then(rep => {
          this.loading = false;
          this.tableData = rep.data;
          this.getTreeData();
          if (rep.data.length > 0) {
            this.renderTree();
          }
        });
    },
    onAdd() {
      this.$refs.wrapper.onAdd();
    }
  },
  mounted() {
    this.render();
  }
};
</script>
<style lang="less">
.page-area {
  display: flex;
  height: 100%;

  &__tree {
    background: #fff;
    border-right: 1px solid #ddd;
    position: relative;
    height: 100%;
    width: 250px;
    padding: 5px;
  }
  &__main {
    flex: 1;
    overflow: hidden;
    min-width: 1000px;
  }
}
</style>
