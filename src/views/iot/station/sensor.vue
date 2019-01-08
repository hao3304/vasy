<template>
    <div class="page-sensor">

        <f-panel>
            <div slot="header">
                <Button type="primary" @click="onAdd"   icon="md-add">传感器</Button>
            </div>
            <div slot="body" slot-scope="props">
                <Table :columns="columns" :data="tableData" size="small" :loading="loading" :height="props.bodyHeight" border class="f-table">
                </Table>
            </div>
        </f-panel>
        <Modal
                v-model="dialog"
                :title="action == 'add'?'新增传感器': '编辑传感器'"
                fullscreen

        >
            <i-form ref="form" :label-width="75" :rules="rules" :model="model">
                <FormItem :label="sensorModel.name" prop="name">
                    <Input v-model="model.name" :placeholder="'请输入'+ sensorModel.name"  />
                </FormItem>
                <FormItem  :label="sensorModel.unit" prop="unit">
                    <Select v-model="model.unit" :placeholder="'请选择'+ sensorModel.unit"  >
                        <Option v-for="t in units" :key="t.id" :value="t.id" :label="t.name"></Option>
                    </Select>
                </FormItem>
                <FormItem :label="sensorModel.channel">
                    <Input v-model="model.channel" :placeholder="'请输入'+ sensorModel.channel"  />
                </FormItem>
                <FormItem :label="sensorModel.tag">
                    <Input v-model="model.tag" :placeholder="'请输入'+ sensorModel.tag"  />
                </FormItem>
                <FormItem :label="sensorModel.transform">
                    <Input v-model="model.transform" :placeholder="'请输入'+ sensorModel.transform"  />
                </FormItem>
                <FormItem :label="sensorModel.expression">
                    <Input v-model="model.expression" :placeholder="'请输入'+ sensorModel.expression"  />
                </FormItem>
                <FormItem :label="sensorModel.remark">
                    <Input v-model="model.remark" type="textarea" :placeholder="'请输入'+ sensorModel.remark"  />
                </FormItem>
                <FormItem :label="sensorModel.status">
                    <RadioGroup v-model.number="model.status">
                        <Radio :label="1">启用</Radio>
                        <Radio :label="0">禁用</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="sensorModel.weight" >
                    <InputNumber  style="width: 100%" :min="0" v-model="model.weight" :placeholder="'请输入'+ sensorModel.weight"  />
                </FormItem>
            </i-form>
            <div slot="footer">
                <Button @click="onCancel">取消</Button>
                <Button @click="onOk" type="primary"  :loading="formLoading">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
import types from "@/types";
const { sensorModel, newSensor } = types;
import { mapState } from "vuex";
import sensorService from "@/services/sensor";
import Vue from "vue";

export default {
  computed: {
    ...mapState("common", ["units"])
  },
  data() {
    return {
      columns: [
        {
          title: "#",
          width: 40,
          type: "index",
          align: "center",
          tooltip: true
        },
        {
          title: sensorModel.name,
          width: 150,
          key: "name"
        },
        {
          title: sensorModel.unit,
          width: 150,
          key: "unit"
        },
        {
          title: sensorModel.channel,
          width: 150,
          key: "channel"
        },
        {
          title: sensorModel.tag,
          width: 160,
          key: "tag"
        },
        {
          title: sensorModel.transform,
          width: 150,
          key: "transform"
        },
        {
          title: sensorModel.expression,
          width: 150,
          key: "expression"
        },
        {
          title: sensorModel.remark,
          width: 200,
          key: "remark"
        },
        {
          title: sensorModel.status,
          width: 100,
          key: "status",
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
          title: sensorModel.weight,
          width: 100,
          key: "weight"
        },
        {
          title: "创建时间",
          width: 150,
          key: "created",
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.created * 1000));
          }
        },
        {
          title: "更新时间",
          minWidth: 150,
          key: "changed",
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.changed * 1000));
          }
        },
        {
          title: "操作",
          width: 150,
          align: "center",
          fixed: "right",
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
                    type: "error",
                    icon: "iconfont icon-shanchu",
                    tooltip: "删除",
                    placement: "right"
                  },
                  on: {
                    click: () =>
                      this.onDelete(
                        row.id,
                        `确定要删除传感器【${row.name}】吗？`
                      )
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        unit: [{ required: true, message: "必选", trigger: "blur" }]
      },
      sensorModel,
      model: newSensor(),
      dialog: false,
      formLoading: false,
      action: "",
      targetRoles: [],
      tableData: [],
      loading: false,
      query: {
        page: 1,
        size: 999,
        count: 1,
        fields: ["*"],
        orders: ["weight"],
        filters: [
          {
            op: "eq",
            field: "station",
            args: [this.$route.params.station]
          },
          {
            op: this.$route.params.device ? "eq" : "null",
            field: "device",
            args: this.$route.params.device
              ? [this.$route.params.device]
              : undefined
          }
        ]
      }
    };
  },
  methods: {
    onAdd() {
      this.targetRoles = [];
      this.dialog = true;
      this.action = "add";
      this.$refs.form.resetFields();
      this.model = newSensor();
      this.model.station = this.$route.params.station;
      this.model.device = this.$route.params.device || null;
      if (this.tableData.length > 0) {
        this.model.weight =
          this.tableData[this.tableData.length - 1].weight + 100;
      }
    },
    onCancel() {
      this.dialog = false;
    },
    onBack() {
      this.$emit("on-back");
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
      sensorService.add(this.model).then(() => {
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
          sensorService
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
      delete values["user"];
      delete values["__typename"];
      this.model = { ...values };
      this.dialog = true;
      this.action = "update";
    },
    update() {
      this.formLoading = true;
      sensorService
        .update(this.model.id, this.model)
        .then(() => {
          this.dialog = false;
          this.$Message.success("编辑成功！");
          this.render();
          this.formLoading = false;
        })
        .catch(() => {
          this.formLoading = false;
        });
    },
    render() {
      this.loading = true;
      sensorService.findAll(this.query).then(rep => {
        this.tableData = rep.data;
        this.loading = false;
      });
    }
  },
  mounted() {
    this.render();
  }
};
</script>
<style lang="less">
.page-sensor {
  height: 100%;
}
</style>
