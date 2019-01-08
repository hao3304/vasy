<template>
    <div style="height: 100%">

        <f-panel :header="false">
            <div slot="body" slot-scope="props">
                <Table
                        size="small"
                        :columns="columns"
                        :data="data"
                        border
                        :height="props.bodyHeight"
                        class="f-table"
                >
                </Table>
            </div>
        </f-panel>

        <Modal
                v-model="dialog"
                :title="title"
                :width="600"
                fullscreen
                :loading="formLoading"
        >
            <i-form ref="form" :label-width="75" :rules="rules" :model="model">
                <FormItem :label="channelModelModel.name" prop="name">
                    <Input v-model="model.name" :placeholder="'请输入'+ channelModelModel.name"  />
                </FormItem>
                <FormItem :label="channelModelModel.channel">
                    <Input v-model="model.channel" :placeholder="'请输入'+ channelModelModel.channel"  />
                </FormItem>
                <FormItem :label="channelModelModel.transform">
                    <Input v-model="model.transform" :placeholder="'请输入'+ channelModelModel.transform"  />
                </FormItem>
                <FormItem :label="channelModelModel.expression">
                    <Input v-model="model.expression" :placeholder="'请输入'+ channelModelModel.expression"  />
                </FormItem>
                <FormItem :label="channelModelModel.template">
                    <Input v-model="model.template" :placeholder="'请输入'+ channelModelModel.template"  />
                </FormItem>
                <FormItem :label="channelModelModel.unit" >
                    <Select v-model="model.unit"  :placeholder="'请选择'+ channelModelModel.unit">
                        <Option v-for="u in units" :key="u.id" :label="u.name" :value="u.id"></Option>
                    </Select>
                </FormItem>
                <FormItem :label="channelModelModel.required">
                    <i-switch v-model="model.required" :true-value="1" :false-value="0"></i-switch>
                </FormItem>
                <FormItem :label="channelModelModel.weight" >
                    <InputNumber  style="width: 100%" :min="0" v-model="model.weight" :placeholder="'请输入'+ channelModelModel.weight"  />
                </FormItem>
                <FormItem :label="channelModelModel.status">
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

    </div>
</template>

<script>
import types from "@/types";
import Vue from "vue";
const { newModelChannel, channelModelModel } = types;
import itemService from "@/services/model_channel";
import { mapState } from "vuex";

export default {
  name: "dictItem",
  computed: {
    ...mapState("common", ["units"])
  },
  data() {
    return {
      newModelChannel: newModelChannel,
      channelModelModel,
      data: [],
      columns: [
        {
          title: "#",
          type: "index",
          width: 80
        },
        // {
        //   title: channelModelModel.model,
        //   key: "model",
        //   width: 120
        // },
        {
          title: channelModelModel.name,
          key: "name",
          width: 150,
          sortable: true
        },
        {
          title: channelModelModel.channel,
          key: "channel",
          width: 140,
          sortable: true
        },
        {
          title: channelModelModel.transform,
          key: "transform",
          width: 150
        },
        {
          title: channelModelModel.expression,
          key: "expression",
          width: 150
        },
        {
          title: channelModelModel.template,
          key: "template",
          width: 200
        },
        {
          title: channelModelModel.unit,
          key: "unit",
          width: 135
        },
        {
          title: channelModelModel.required,
          key: "required",
          width: 140,
          render(h, { row }) {
            if (row.required) {
              return h("Icon", {
                props: {
                  type: "md-checkmark"
                }
              });
            }
          }
        },
        {
          title: channelModelModel.status,
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
          title: channelModelModel.weight,
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
                    type: "error",
                    icon: "iconfont icon-shanchu",
                    tooltip: "删除",
                    placement: "right"
                  },
                  on: {
                    click: () =>
                      this.onDelete(row.id, `确定要删除通道【${row.name}】吗？`)
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      rules: {
        model: [{ required: true, message: "必填", trigger: "blur" }],
        name: [{ required: true, message: "必填", trigger: "blur" }],
        value: [{ required: true, message: "必填", trigger: "blur" }]
      },
      parent: {},
      dialog: false,
      title: "新增通道",
      formLoading: false,
      loading: false,
      model: newModelChannel(),
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
            field: "model",
            args: []
          }
        ]
      }
    };
  },
  methods: {
    setParent(data) {
      this.parent = data;
      this.model.model = data.id;
      this.query.filters[0].args = [data.id];
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
      this.model = newModelChannel();
      this.model.model = this.query.filters[0].args[0];
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
      this.model = newModelChannel();
    }
  }
};
</script>

<style lang="less">
</style>
