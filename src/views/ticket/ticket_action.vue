<template>
    <div class="page-ticket-action" style="height: 100%">

        <f-panel>
            <div slot="header">
                <Button type="primary" :disabled="!typeId" @click="onAdd"  style="margin-left: 10px;" icon="md-add">操作</Button>
            </div>
            <div slot="body" slot-scope="props">
                <div v-show="mode == 'chart'" class="page-ticket-action__body wrapper-body" >
                    <div class="page-ticket-action__table">
                        <table>
                            <tr v-for="(row, y) in getTableRows()" :key="y">
                                <td v-for="(col, x) in row" :key="x">
                                    <span v-if="y == 0">{{col.estate.name}}</span>
                                    <span v-if="x == 0">{{col.sstate.name}}</span>
                                    <span v-if="y!=0&& x!=0">
                                    <Button @click="onEdit(t)" size="small" type="primary" style="margin-right: 5px" v-for="(t, i) in tableData" :key="i" v-if="t.sstate == col.sstate.id && t.estate == col.estate.id">{{t.name}}</Button>
                                    <Button @click="onAdd(col)" type="dashed" icon="md-add" size="small"></Button>
                                </span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div v-show="mode == 'table'" class="page-ticket-action__body wrapper-body">
                    <Table :height="props.bodyHeight" border size="small" :columns="columns" :data="tableData" :loading="loading" class="f-table">
                    </Table>
                </div>
            </div>
        </f-panel>


        <Modal
                v-model="dialog"
                :title="active == 'add'?'新增操作': '编辑操作'"
                fullscreen
        >
            <i-form ref="form" :label-width="75" :rules="rules" :model="model">
                <FormItem :label="ticketActionModel.name" prop="name">
                    <Input v-model="model.name" :placeholder="'请输入'+ ticketActionModel.name"  />
                </FormItem>
                <FormItem  :label="ticketActionModel.sstate" prop="sstate">
                    <Select v-model="model.sstate" :placeholder="'请选择'+ ticketActionModel.sstate"  >
                        <Option v-for="t in ticketType.states" :key="t.id" :value="t.id" :label="t.name"></Option>
                    </Select>
                </FormItem>
                <FormItem  :label="ticketActionModel.estate" prop="estate">
                    <Select v-model="model.estate" :placeholder="'请选择'+ ticketActionModel.estate"  >
                        <Option v-for="t in ticketType.states" :key="t.id" :value="t.id" :label="t.name"></Option>
                    </Select>
                </FormItem>
                <FormItem :label="ticketActionModel.status">
                    <RadioGroup v-model.number="model.status">
                        <Radio :label="1">启用</Radio>
                        <Radio :label="0">禁用</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="ticketActionModel.weight" >
                    <InputNumber  style="width: 100%" :min="0" v-model="model.weight" :placeholder="'请输入'+ ticketActionModel.weight"  />
                </FormItem>
                <FormItem :label="ticketActionModel.remark">
                    <Input v-model="model.remark" type="textarea" :placeholder="'请输入'+ ticketActionModel.remark"  />
                </FormItem>
            </i-form>
            <div slot="footer">
                <Button @click="onCancel">取消</Button>
                <Button @click="onOk"  :loading="formLoading"
                        type="primary">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
import types from "@/types";
const { ticketActionModel, newTicketAction, userModel } = types;
import { mapState, mapMutations } from "vuex";
import ticketActionService from "@/services/ticket/ticket_action";
import { TicketTypeById } from "@/graphqls/ticket.graphql";

import Vue from "vue";

export default {
  props: ["typeId"],
  computed: {
    ...mapState("common", ["ticketMode"])
  },
  watch: {
    typeId() {
      if (this.typeId) {
        this.render();
      } else {
        this.tableData = [];
      }
    }
  },
  data() {
    let self = this;
    return {
      mode: "table",
      query: {
        page: 1,
        size: 999,
        count: 1,
        fields: ["*"],
        orders: ["weight"],
        filters: [
          {
            op: "eq",
            field: "type",
            args: []
          }
        ]
      },
      loading: false,
      columns: [
        {
          title: "#",
          width: 40,
          type: "index",
          align: "center",
          tooltip: true
        },
        {
          title: ticketActionModel.name,
          width: 120,
          key: "name"
        },
        {
          title: ticketActionModel.sstate,
          width: 120,
          key: "sstate",
          render: (h, { row }) => {
            const state = self.ticketType.states.find(s => s.id == row.sstate);
            return h("Tag", {}, state ? state.name : "");
          }
        },
        {
          title: ticketActionModel.estate,
          width: 120,
          key: "estate",
          render: (h, { row }) => {
            const state = self.ticketType.states.find(s => s.id == row.estate);
            return h("Tag", {}, state ? state.name : "");
          }
        },
        {
          title: ticketActionModel.weight,
          width: 120,
          key: "weight"
        },
        {
          title: ticketActionModel.remark,
          width: 200,
          key: "remark"
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
          minWidth: 120,
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
                    icon: "iconfont icon-liebiao",
                    type: "primary",
                    tooltip: "表单",
                    placement: "top"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      parent.window.eventBus.$emit("add_tab", {
                        text: `【${row.name}】的表单`,
                        path: "/ticket/field/" + row.id
                      });
                    }
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
                      this.onDelete(row.id, `确定要删除操作【${row.name}】吗？`)
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      userColumn: [
        {
          title: "名称",
          key: "name",
          sortable: "custom"
        },
        {
          title: userModel.account,
          key: "account",
          sortable: "custom"
        },
        {
          title: userModel.job,
          key: "job"
        }
      ],
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        sstate: [{ required: true, message: "必选", trigger: "change" }],
        estate: [{ required: true, message: "必选", trigger: "change" }]
      },
      tableData: [],
      ticketActionModel,
      model: newTicketAction(),
      userFilter: [
        {
          type: "input",
          name: userModel.name,
          field: "name",
          placeholder: `请输入${userModel.name}模糊查询`
        },
        {
          type: "input",
          name: userModel.account,
          field: "account",
          placeholder: `请输入${userModel.account}模糊查询`
        }
      ],
      ticketType: {
        name: "",
        states: []
      },
      dialog: false,
      formLoading: false,
      active: "",
      userName: ""
    };
  },
  apollo: {
    ticketType: {
      query: TicketTypeById,
      variables() {
        return {
          id: this.typeId
        };
      },
      skip() {
        return !this.typeId;
      },
      update(data) {
        if (data.ticketType.length > 0) {
          return data.ticketType[0];
        } else {
          return {};
        }
      }
    }
  },
  methods: {
    ...mapMutations("app", ["add_tab"]),
    getTableRows() {
      const rows = [];
      for (let y = 0; y <= this.ticketType.states.length; y++) {
        const row = [];
        for (let x = 0; x <= this.ticketType.states.length; x++) {
          if (x == 0 && y == 0) {
            row.push({
              x,
              y,
              estate: {},
              sstate: {}
            });
          } else {
            if (y == 0) {
              row.push({
                x,
                y,
                estate: this.ticketType.states[x - 1]
              });
            } else if (x == 0) {
              row.push({
                x,
                y,
                sstate: this.ticketType.states[y - 1]
              });
            } else {
              row.push({
                x,
                y,
                estate: this.ticketType.states[x - 1],
                sstate: this.ticketType.states[y - 1]
              });
            }
          }
        }
        rows.push(row);
      }
      return rows;
    },
    onAdd(data) {
      this.dialog = true;
      this.active = "add";
      this.$refs.form.resetFields();
      this.model = newTicketAction();
      this.model.sstate = data.sstate ? data.sstate.id : null;
      this.model.estate = data.estate ? data.estate.id : null;
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
      this.model.type = this.typeId;
      ticketActionService.add(this.model).then(() => {
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
          ticketActionService
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
      this.updateId = values.id;
    },
    update() {
      this.formLoading = true;
      ticketActionService
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
    render() {
      this.loading = true;
      this.query.filters[0].args = [this.typeId];
      ticketActionService.findAll(this.query).then(rep => {
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
.page-ticket-action {
  display: flex;
  flex: 1;
  flex-direction: column;
  &__table {
    padding: 20px 0;
    table {
      border-collapse: collapse;
      margin: 0 auto;
      td,
      tr {
        border: 1px solid #ccc;
      }

      td {
        padding: 10px 25px;
        font-size: 16px;
        text-align: center;
      }
    }
  }
}
</style>
