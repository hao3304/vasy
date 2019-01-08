<template>

        <f-panel>
            <div slot="header">
                <Button type="primary" @click="onAdd" :disabled="!typeId"  style="margin-left: 10px;" icon="md-add">状态</Button>
            </div>
            <div slot="body" slot-scope="props">
                <Table
                        :columns="columns"
                       size="small"
                       border
                        :height="props.bodyHeight"
                       :data="ticketType.states"
                       :loading="$apollo.queries.ticketType.loading"
                       class="f-table">
                </Table>
                <Modal
                        v-model="dialog"
                        :title="active == 'add'?'新增状态': '编辑状态'"
                        fullscreen
                >
                    <i-form ref="form" :label-width="75" :rules="rules" :model="model">
                        <FormItem :label="ticketStateModel.name" prop="name">
                            <Input v-model="model.name" :placeholder="'请输入'+ ticketStateModel.name"  />
                        </FormItem>
                        <FormItem  :label="ticketStateModel.mode" prop="mode">
                            <Select v-model="model.mode" :placeholder="'请选择'+ ticketStateModel.mode"  >
                                <Option v-for="t in ticketMode" :key="t.id" :value="t.id" :label="t.name"></Option>
                            </Select>
                        </FormItem>
                        <FormItem  :label="ticketStateModel.uid">
                            <table-select table="user" :filter="userFilter" :text="userName" :placeholder="'请选择'+ ticketStateModel.mode"  :columns="userColumn" text-field="name" v-model="model.uid" ></table-select>
                        </FormItem>
                        <FormItem v-if="active == 'update'" :label="ticketStateModel.status">
                            <RadioGroup v-model.number="model.status">
                                <Radio :label="1">启用</Radio>
                                <Radio :label="0">禁用</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem :label="ticketStateModel.weight" >
                            <InputNumber  style="width: 100%" :min="0" v-model="model.weight" :placeholder="'请输入'+ ticketStateModel.weight"  />
                        </FormItem>
                        <FormItem label="状态角色">
                            <div class="role-list" style="max-height: 200px;overflow-y: auto">
                                <CheckboxGroup v-model="targetRoles">
                                    <div class="role-list__item" style="line-height: 20px" v-for="r in roles" :key="r.id">
                                        <Checkbox :label="r.id" >
                                            {{r.name}}
                                        </Checkbox>
                                    </div>
                                </CheckboxGroup>
                            </div>
                        </FormItem>
                    </i-form>
                    <div slot="footer">
                        <Button @click="onCancel">取消</Button>
                        <Button @click="onOk" type="primary"  :loading="formLoading">确定</Button>
                    </div>
                </Modal>

            </div>
        </f-panel>


</template>
<script>
import types from "@/types";
const { ticketStateModel, newTicketState, userModel } = types;
import { mapState } from "vuex";
import tableSelect from "@/components/tableSelect";
import {
  TicketTypeById,
  TicketStateUpdate,
  TicketStateCreate
} from "@/graphqls/ticket.graphql";
import ticketStateService from "@/services/ticket/ticket_state";
import Vue from "vue";

export default {
  props: ["typeId"],
  components: {
    tableSelect
  },
  computed: {
    ...mapState("common", ["ticketMode", "roles"])
  },
  watch: {
    typeId() {
      if (this.typeId) {
        this.render();
      } else {
        this.ticketType = {
          name: "",
          states: []
        };
      }
    }
  },
  data() {
    let self = this;
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
          title: ticketStateModel.name,
          width: 150,
          key: "name"
        },
        {
          title: ticketStateModel.mode,
          width: 120,
          key: "mode",
          render: (h, { row }) => {
            const mode = self.ticketMode.find(t => t.id == row.mode);
            return h("div", {}, mode ? mode.name : "");
          }
        },
        {
          title: ticketStateModel.uid,
          width: 150,
          key: "uid",
          render: (h, { row }) => {
            return h("div", row.user ? row.user.name : "-");
          }
        },
        {
          title: ticketStateModel.status,
          width: 100,
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
          }
        },
        {
          title: "状态角色",
          width: 200,
          tooltip: true,
          render: (h, { row }) => {
            return h(
              "div",
              {},
              row.roles.map(role => {
                return h("Tag", {}, role.name);
              })
            );
          }
        },
        {
          title: ticketStateModel.weight,
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
                    marginRight: "5px"
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
                      this.onDelete(row.id, `确定要删除状态【${row.name}】吗？`)
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
        mode: [
          { required: true, type: "number", message: "必选", trigger: "change" }
        ]
      },
      ticketType: {
        name: "",
        states: []
      },
      ticketStateModel,
      model: newTicketState(),
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
      dialog: false,
      formLoading: false,
      active: "",
      userName: "",
      targetRoles: []
    };
  },
  apollo: {
    ticketType: {
      query: TicketTypeById,
      fetchPolicy: "network-only",
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
    onAdd() {
      this.targetRoles = [];
      this.dialog = true;
      this.active = "add";
      this.$refs.form.resetFields();
      this.model = newTicketState();
      if (this.ticketType.states.length > 0) {
        this.model.weight =
          this.ticketType.states[this.ticketType.states.length - 1].weight +
          100;
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
          if (this.active == "update") {
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

      this.$apollo
        .mutate({
          mutation: TicketStateCreate,
          variables: {
            type: this.model.type,
            name: this.model.name,
            mode: this.model.mode,
            uid: this.model.uid,
            weight: this.model.weight,
            roles: this.targetRoles
          }
        })
        .then(() => {
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
          ticketStateService
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
      this.userName = data.user ? data.user.name : "";
      const values = JSON.parse(JSON.stringify(data));
      this.targetRoles = values.roles.map(r => r.id);
      delete values["_rowKey"];
      delete values["_index"];
      delete values["user"];
      delete values["__typename"];
      this.model = { ...values };
      this.dialog = true;
      this.active = "update";
    },
    update() {
      this.formLoading = true;
      this.$apollo
        .mutate({
          mutation: TicketStateUpdate,
          variables: {
            id: this.model.id,
            status: this.model.status,
            type: this.model.type,
            name: this.model.name,
            mode: this.model.mode,
            uid: this.model.uid,
            weight: this.model.weight,
            roles: this.targetRoles
          }
        })
        .then(() => {
          //     console.log(rep);
          this.dialog = false;
          this.$Message.success("编辑成功！");
          this.render();
          this.formLoading = false;
        });
    },
    render() {
      this.$apollo.queries.ticketType.refetch();
    }
  }
};
</script>
<style lang="less">
.page-ticket-state {
  height: 100%;
}
</style>
