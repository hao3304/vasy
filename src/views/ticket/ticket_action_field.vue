<template>
    <div class="page-ticket-field">

        <f-panel>
            <div slot="header">
                <Button type="primary" @click="onAdd"  style="margin-left: 10px;" icon="md-add">字段</Button>
            </div>
           <div slot="body" slot-scope="props">
               <Table :columns="columns" border size="small" :data="tableData" :loading="loading" :height="props.bodyHeight" class="f-table">
               </Table>
           </div>
        </f-panel>

        <Modal
                v-model="dialog"
                :title="action == 'add'?'新增字段': '编辑字段'"
                fullscreen

        >
            <i-form ref="form" :label-width="75" :rules="rules" :model="model">
                <FormItem :label="ticketActionFieldModel.name" prop="name">
                    <Input v-model="model.name" :placeholder="'请输入'+ ticketActionFieldModel.name"  />
                </FormItem>
                <FormItem  :label="ticketActionFieldModel.ftype" prop="ftype">
                    <Select v-model="model.ftype" :placeholder="'请选择'+ ticketActionFieldModel.ftype"  >
                        <Option v-for="t in filedType" :key="t.id" :value="t.id" :label="t.name"></Option>
                    </Select>
                </FormItem>
                <FormItem :label="ticketActionFieldModel.ofield">
                    <Input v-model="model.ofield" :placeholder="'请输入'+ ticketActionFieldModel.ofield"  />
                </FormItem>
                <FormItem :label="ticketActionFieldModel.default">
                    <Input v-model="model.default" :placeholder="'请输入'+ ticketActionFieldModel.default"  />
                </FormItem>
                <FormItem :label="ticketActionFieldModel.format">
                    <Input v-model="model.format" :placeholder="'请输入'+ ticketActionFieldModel.format"  />
                </FormItem>
                <FormItem :label="ticketActionFieldModel.required">
                    <RadioGroup v-model.number="model.required">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem :label="ticketActionFieldModel.tfield">
                    <Input v-model="model.tfield" :placeholder="'请输入'+ ticketActionFieldModel.tfield"  />
                </FormItem>

                <FormItem :label="ticketActionFieldModel.backfill">
                    <i-switch :true-value.number="1" :false-value.number="0" v-model="model.backfill">
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </i-switch>
                </FormItem>


                <FormItem :label="ticketActionFieldModel.desc">
                    <Input v-model="model.desc" :placeholder="'请输入'+ ticketActionFieldModel.desc"  />
                </FormItem>
                <FormItem :label="ticketActionFieldModel.status">
                    <RadioGroup v-model.number="model.status">
                        <Radio :label="1">启用</Radio>
                        <Radio :label="0">禁用</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="ticketActionFieldModel.weight" >
                    <InputNumber  style="width: 100%" :min="0" v-model="model.weight" :placeholder="'请输入'+ ticketActionFieldModel.weight"  />
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
const { ticketActionFieldModel, newTicketActionField } = types;
import { mapState } from "vuex";
import ticketActionFieldService from "@/services/ticket/ticket_action_field";
import Vue from "vue";

export default {
  computed: {
    ...mapState("common", ["filedType"])
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
          title: ticketActionFieldModel.name,
          width: 150,
          key: "name"
        },
        {
          title: ticketActionFieldModel.ofield,
          width: 150,
          key: "ofield"
        },
        {
          title: ticketActionFieldModel.ftype,
          width: 150,
          key: "ftype",
          render: (h, { row }) => {
            const type = this.filedType.find(f => f.id == row.ftype);
            return h("div", {}, type.name);
          }
        },
        {
          title: ticketActionFieldModel.format,
          width: 150,
          key: "format"
        },
        {
          title: ticketActionFieldModel.default,
          width: 150,
          key: "default"
        },
        {
          title: ticketActionFieldModel.tfield,
          width: 150,
          key: "tfield"
        },
        {
          title: ticketActionFieldModel.backfill,
          width: 150,
          render(h, { row }) {
            return h("div", {}, row.backfill ? "是" : "否");
          }
        },
        {
          title: ticketActionFieldModel.required,
          width: 150,
          key: "required",
          render(h, { row }) {
            return h("div", {}, row.required ? "是" : "否");
          }
        },
        {
          title: ticketActionFieldModel.desc,
          width: 200,
          key: "desc"
        },
        {
          title: ticketActionFieldModel.status,
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
          title: ticketActionFieldModel.weight,
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
                      this.onDelete(row.id, `确定要删除字段【${row.name}】吗？`)
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
        ofield: [{ required: true, message: "必填", trigger: "blur" }],
        ftype: [{ required: true, message: "必选", trigger: "change" }]
      },
      ticketActionFieldModel,
      model: newTicketActionField(),
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
            field: "action",
            args: [this.$route.params.actionId]
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
      this.model = newTicketActionField();
      this.model.action = this.$route.params.actionId;
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
      ticketActionFieldService.add(this.model).then(() => {
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
          ticketActionFieldService
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
      ticketActionFieldService
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
      ticketActionFieldService.findAll(this.query).then(rep => {
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
.page-ticket-field {
  height: 100%;
}
</style>
