<template>
    <div style="position: relative;height: 100%">

        <two-v>
            <x-wrapper
                    slot="top"
                    title="工单类型"
                    service="ticket_type"
                    :columns="columns"
                    :model="model"
                    :rules="rules"
                    :filter="filter"
                    ref="wrapper"
                    :height="windowHeight - 300"
                    :loads="true"
                    :orders="['id']"
                    @refresh="onRefresh"
                    @on-row-click="onRowSelect"
            >
                <div slot="dialog" slot-scope="{ model }">
                    <FormItem :label="ticketTypeModel.name" prop="name">
                        <Input v-model="model.name" :placeholder="'请输入'+ ticketTypeModel.name"  />
                    </FormItem>
                    <FormItem label="服务时限（分）" >
                        <InputNumber  style="width: 100%" :min="0" v-model="model.term" :placeholder="'请输入'+ ticketTypeModel.term "  >
                        </InputNumber>
                    </FormItem>
                    <FormItem label="目标对象">
                        <Input v-model="model.otype" :placeholder="'请输入'+ ticketTypeModel.otype"  />
                    </FormItem>
                    <FormItem :label="ticketTypeModel.weight" >
                        <InputNumber  style="width: 100%" :min="0" v-model="model.weight" :placeholder="'请输入'+ ticketTypeModel.weight"  />
                    </FormItem>
                    <FormItem :label="ticketTypeModel.status">
                        <RadioGroup v-model.number="model.status">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">禁用</Radio>
                        </RadioGroup>
                    </FormItem>
                </div>
            </x-wrapper>

                <Tabs slot="bottom" class="f-tabs" style="height: 100%" >
                    <TabPanel  title="工单状态">
                        <ticket_state  :type-id="selectType" ></ticket_state>
                    </TabPanel>
                    <TabPanel title="工单操作">
                        <ticket_action :type-id="selectType" ></ticket_action>
                    </TabPanel>
                </Tabs>
        </two-v>


        <!--<transition name="fadeRight">-->
        <!--<div style="padding: 10px 15px;position: absolute;top:0;left:0;right:0;bottom:0;" v-if="selectType.id">-->
        <!--<ticket_state v-if="action =='state'&&t.id == 'state'" :type-id="selectType.id" @on-back="onBack"></ticket_state>-->
        <!--<ticket_action_field @on-close="onTabRemove" v-if="index > 1" :actionId='t.id'></ticket_action_field>-->

        <!--</div>-->
        <!--</transition>-->
    </div>
</template>
<script>
import types from "@/types";
const { ticketTypeModel, newTicketType } = types;
import Vue from "vue";
import ticket_state from "./ticket_state";
import ticket_action from "./ticket_action";
import ticket_action_field from "./ticket_action_field";
import { mapMutations, mapState } from "vuex";
export default {
  components: {
    ticket_state,
    ticket_action,
    ticket_action_field
  },
  computed: {
    ...mapState(["windowHeight"])
  },
  data() {
    return {
      ticketTypeModel,
      columns: [
        {
          width: 40,
          align: "center",
          type: "selection"
        },
        {
          title: ticketTypeModel.name,
          width: 150,
          key: "name",
          sortable: "custom"
        },
        {
          title: ticketTypeModel.status,
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
          title: ticketTypeModel.term,
          width: 200,
          key: "term",
          sortable: "custom"
        },
        {
          title: ticketTypeModel.otype,
          width: 200,
          key: "otype"
        },
        {
          title: ticketTypeModel.weight,
          width: 100,
          key: "weight"
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
          minWidth: 150,
          key: "changed",
          sortable: "custom",
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.changed * 1000));
          }
        },
        {
          title: "操作",
          width: 120,
          fixed: "right",
          align: "center",
          render: (h, { row }) => {
            return h("div", [
              h("ButtonGroup", {
                style: {
                  marginRight: "5px"
                }
              }),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => this.$refs.wrapper.onEdit(row)
                  }
                },
                "编辑"
              ),

              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () =>
                      this.$refs.wrapper.onDelete(
                        row.id,
                        `确定要删除角色【${row.name}】吗？`
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
        name: [{ required: true, message: "必填", trigger: "blur" }]
      },
      filter: [
        {
          type: "input",
          name: ticketTypeModel.name,
          field: "name",
          placeholder: "请输入类型名称模糊查询"
        }
      ],
      total: 0,
      model: newTicketType,
      selectType: null,
      action: "",
      tabs: [
        {
          name: "工单状态",
          id: "state"
        },
        {
          name: "工单操作",
          id: "action"
        }
      ]
    };
  },
  methods: {
    ...mapMutations("app", ["SET_CHILDREN_MENU_TITLE"]),
    onRowSelect(row) {
      this.selectType = row.id;
    },
    onRefresh() {
      this.selectType = null;
    }
  }
};
</script>
<style lang="less">
</style>
