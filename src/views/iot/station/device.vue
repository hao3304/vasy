<template>

    <f-panel :header="false">
        <div slot="body" slot-scope="props">
            <Table
                    :height="props.bodyHeight"
                    size="small"
                    border
                    :loading="loading"
                    class="f-table"
                    :columns="columns"
                    :data="data"
            >
            </Table>
            <Modal
                    v-model="dialog"
                    :title="title"
                    fullscreen
                    :loading="formLoading"
            >
                <i-form ref="form" :label-width="75" :rules="rules" :model="model">
                    <FormItem :label="deviceModel.name" prop="name">
                        <Input v-model="model.name" :placeholder="'请输入'+ deviceModel.name"  />
                    </FormItem>
                    <FormItem :label="deviceModel.type">
                        <Input v-model="model.type" :placeholder="'请输入'+ deviceModel.type"  />
                    </FormItem>
                    <FormItem :label="deviceModel.model">
                        <Select v-model="model.model" :placeholder="'请选择'+ deviceModel.model"  >
                            <Option v-for="m in models" :key="m.id" :value='m.id' :label="m.name"></Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="deviceModel.weight" >
                        <InputNumber  style="width: 100%" :min="0" v-model="model.weight" :placeholder="'请输入'+ deviceModel.weight"  />
                    </FormItem>
                    <FormItem :label="deviceModel.status">
                        <RadioGroup v-model.number="model.status">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">禁用</Radio>
                        </RadioGroup>
                    </FormItem>
                </i-form>
                <div slot="footer">
                    <Button @click="onCancel">取消</Button>
                    <Button @click="onOk" type="primary">确定</Button>
                </div>
            </Modal>
            <Modal title='实例化模版' v-model="modelDialog">
                <Select v-model="template" placeholder="请选择模版">
                    <Option  v-for="model in models" :key="model.id" :label="model.name" :value="model.id"></Option>
                </Select>
                <div slot="footer">
                    <Button @click="modelDialog = false">取消</Button>
                    <Button @click="onInitTemplate" type="primary">确定</Button>
                </div>
            </Modal>
        </div>
    </f-panel>
</template>

<script>
import types from "@/types";
import Vue from "vue";
const { newDevice, deviceModel } = types;
import itemService from "@/services/device";
import { mapState } from "vuex";
import { InitDevice } from "@/graphqls/station.graphql";
export default {
  props: ["sid"],
  name: "dictItem",
  computed: {
    ...mapState("common", ["models"])
  },
  watch: {
    sid() {
      if (this.sid) {
        this.setParent(this.sid);
      } else {
        this.data = [];
      }
    }
  },
  data() {
    return {
      newDevice: newDevice,
      deviceModel,
      data: [],
      template: "",
      columns: [
        {
          title: "#",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: deviceModel.name,
          key: "name",
          width: 150,
          sortable: true
        },
        {
          title: deviceModel.type,
          key: "type",
          width: 140,
          sortable: true
        },
        {
          title: deviceModel.model,
          key: "model",
          width: 120
        },
        {
          title: deviceModel.status,
          key: "status",
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
          title: deviceModel.weight,
          key: "weight",
          width: 100,
          sortable: true
        },
        {
          title: "创建时间",
          key: "created",
          width: 120,
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.created * 1000));
          }
        },
        {
          title: "更新时间",
          key: "changed",
          minWidth: 120,
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.changed * 1000));
          }
        },
        {
          title: "操作",
          width: 150,
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
                    click: () => this.onEdit(row)
                  }
                },
                "编辑"
              ),
              h(
                "iconButton",
                {
                  props: {
                    icon: "iconfont icon-liebiao1",
                    type: "success",
                    tooltip: "传感器",
                    placement: "top"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => this.showSensor(row)
                  }
                },
                "传感器"
              ),
              h(
                "iconButton",
                {
                  props: {
                    icon: "iconfont icon-moban",
                    type: "primary",
                    tooltip: "实例化模版",
                    placement: "top"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.selectData = row;
                      this.template = "";
                      this.modelDialog = true;
                    }
                  }
                },
                "实例化"
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
                      this.onDelete(row.id, `确定要删除设备【${row.name}】吗？`)
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }]
      },
      parent: {},
      dialog: false,
      title: "新增设备",
      formLoading: false,
      loading: false,
      model: newDevice(),
      action: "",
      query: {
        page: 1,
        size: 999,
        count: 1,
        fields: ["*"],
        orders: ["-changed"],
        filters: [
          {
            op: "eq",
            field: "station",
            args: []
          }
        ]
      },
      modelDialog: false
    };
  },
  methods: {
    setParent(id) {
      this.model.station = id;
      this.query.filters[0].args = [id];
      this.render();
    },
    render() {
      this.loading = true;
      itemService.findAll(this.query).then(rep => {
        this.data = rep.data;
        this.loading = false;
      });
    },
    onAdd() {
      this.dialog = true;
      this.active = "add";
      this.$refs.form.resetFields();
      this.model = newDevice();
      this.model.station = this.query.filters[0].args[0];
    },
    onCancel() {
      this.dialog = false;
    },
    onOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.action == "update") {
            this.update();
          } else {
            this.save();
          }
        } else {
          this.$Message.warning("请填写完整！");
        }
      });
    },
    save() {
      this.formLoading = true;
      itemService.add(this.model).then(() => {
        this.formLoading = false;
        this.dialog = false;
        this.$Message.success("新增成功！");
        this.render();
      });
    },
    onDelete(id, str) {
      this.$Modal.confirm({
        title: "提示",
        content: str ? str : "确定要删除当前选择数据吗？",
        loading: true,
        onOk: () => {
          itemService
            .remove(id)
            .then(() => {
              this.$Modal.remove();
              this.$Message.success("删除成功！");
              this.render();
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    onEdit(data) {
      this.$refs.form.resetFields();
      const values = JSON.parse(JSON.stringify(data));
      delete values["_rowKey"];
      delete values["_index"];
      this.model = { ...values };
      this.dialog = true;
      this.action = "update";
      this.updateId = values.id;
    },
    update() {
      this.formLoading = true;
      itemService
        .update(this.updateId, this.model)
        .then(rep => {
          console.log(rep);
          this.dialog = false;
          this.$Message.success("编辑成功！");
          this.render();
          this.formLoading = false;
        })
        .catch(() => {
          this.formLoading = false;
        });
    },
    reset() {
      this.query.filters[0].args = [];
      this.parent = {};
      this.data = [];
      this.model = newDevice();
    },
    showSensor(row) {
      parent.window.eventBus.$emit("add_tab", {
        text: `【${row.name}】的传感器`,
        path: "/iot/sensor/" + this.parent.id + "/" + row.id
      });
      // this.$emit("add-tab", {
      //   station: this.parent.id,
      //   device: row.id,
      //   name: `${this.parent.name}-${row.name}`
      // });
    },
    onInitTemplate() {
      if (!this.template) return this.$Message.warning("请选择模版!");
      this.$Modal.confirm({
        title: "提示",
        content: `确定对设备【${this.selectData.name}】进行实例化操作？`,
        onOk: () => {
          this.$apollo
            .mutate({
              mutation: InitDevice,
              variables: {
                model: this.template,
                device: this.selectData.id
              }
            })
            .then(() => {
              this.modelDialog = false;
              this.$Message.success("操作成功！");
              this.onRefresh();
            });
        }
      });
    }
  }
};
</script>

<style lang="less">
.page-device {
  position: relative;
  &__toolbar {
    position: absolute;
    top: -45px;
    left: 30px;
    display: flex;
    align-items: center;
  }
}
</style>
