<template>
    <div class="event-manager">

        <f-panel>
            <div slot="header">
                <x-filter @on-filter="onFilter" :list="filterList">
                    <!--<Button type="primary" @click="onAdd"  style="margin-right: 10px;margin-left: 20px;" icon="md-add" slot="buttons">创建工单</Button>-->
                    <Tooltip content="导出" placement="bottom" slot="right-block" style="margin-right: 10px;"  >
                        <Button @click="onExport" icon="md-download" style="padding: 5px 8px;"></Button>
                    </Tooltip>
                    <Tooltip content="列设置" placement="bottom" slot="right-block" style="margin-right: 10px;"  >
                        <Button @click="onShowColumn" icon="md-settings" style="padding: 5px 8px;"></Button>
                    </Tooltip>
                    <Tooltip content="刷新" placement="bottom" slot="right-block"  style="margin-right: 5px;" >
                        <Button @click="onRefresh" icon="md-refresh" style="padding: 5px 8px;"></Button>
                    </Tooltip>
                </x-filter>
            </div>
            <div slot="body" slot-scope="props">


                <div style="padding: 10px;">
                    我的工单： <i-switch @on-change="onSelectOwn" v-model="query.own"></i-switch>
                    &nbsp;&nbsp;&nbsp;&nbsp;状态：
                    <Button style="margin-right: 10px;" @click="onSelectStatus(s)" :type="query.status == s.id? 'primary': 'default'" v-for="(s, index) in statusList" :key="index">{{s.name}}（{{s.count}}）</Button>
                </div>

                <div class="wrapper-body" style="border-top: 1px solid #ddd" >
                    <Table ref="xTable"
                           :loading="$apollo.queries.tickets.loading"
                           :highlight-row="true"
                           size="small"
                           border
                           @on-row-dblclick="onShowDetail"
                           :columns="localColumns"
                           :data="tickets.data"
                           :height="props.bodyHeight - 52" class="f-table"></Table>
                </div>

                <x-column :name="service" @on-select="onSelectColumns"  :visible.sync="showColumn"  :columns="columns"></x-column>

            </div>
            <div slot="footer">
                <f-page  :total="tickets.total" @on-page-change="onPage"></f-page>
            </div>
        </f-panel>

        <Modal :width="600" :title="selectAction.name" v-model="dialog" >
            <action-form ref="actionForm" :roles="selectTicket.tstate.roles" :fields="selectAction.fields"></action-form>

            <i-form :label-width="75" >
                <FormItem label="当前指派" v-show="selectAction.name != '结单'">
                    <user-select placeholder="请选择当前工单指派人员" :roles="selectTicket.tstate.roles" v-model="form.assignee"></user-select>
                </FormItem>
                <FormItem label="备注">
                    <Input placeholder="请输入备注" type="textarea" v-model="form.remark" />
                </FormItem>
            </i-form>

            <div slot="footer">
                <Button @click="onCancel">取消</Button>
                <Button @click="onOk"  :loading="formLoading" type="primary">确定</Button>
            </div>
        </Modal>

        <!--<map-position @on-select="onSelectPosition" :show.sync="showMap"></map-position>-->
        <Modal v-model="showDetail" footer-hide title="工单详情">
            <ticket-detail :ticket="selectTicket"></ticket-detail>
        </Modal>
    </div>
</template>

<script>
import xFilter from "@/components/FFilter";
import xColumn from "@/components/xColumn";
import types from "@/types";
const { ticketModel } = types;
import { GetEventStat, Hello, UpdatePosition } from "@/graphqls/event.graphql";
import {
  GetTickets,
  TicketAction,
  TicketStat
} from "@/graphqls/ticket.graphql";
import { mapState } from "vuex";
import moment from "moment";
import actionForm from "./action-form";
import userSelect from "@/components/userSelect";
import mapPosition from "@/components/mapPosition";
import ticketDetail from "./ticketDetail";
const Query = () => {
  return {
    limit: 20,
    page: 1,
    count: true,
    orders: ["-id"],
    status: null,
    address: null,
    pstime: null,
    petime: null,
    remark: null,
    time: null,
    sn: null,
    own: false
  };
};

export default {
  name: "event",
  components: {
    xFilter,
    xColumn,
    actionForm,
    userSelect,
    mapPosition,
    ticketDetail
  },
  computed: {
    ...mapState(["windowHeight"]),
    ...mapState("common", ["ticketStatus", "ticket_types"]),
    statusList() {
      if (Object.keys(this.ticket_stat.status).length > 0) {
        let list = JSON.parse(JSON.stringify(this.ticketStatus));

        let total = 0;
        Object.keys(this.ticket_stat.status).forEach(item => {
          if (item != "__typename") {
            total += this.ticket_stat.status[item];
          }
        });

        list = [
          {
            id: null,
            name: "全部",
            count: 0
          }
        ].concat(list);

        return list.map(item => {
          return {
            id: item.id,
            name: item.name,
            count: item.id == null ? total : this.ticket_stat.status[item.id]
          };
        });
      } else {
        return [];
      }
    }
  },
  data() {
    return {
      mode: "综合查询",
      filterList: [
        {
          type: "input",
          name: ticketModel.sn,
          field: "sn",
          placeholder: `请输入${ticketModel.sn}模糊查询`
        },
        {
          type: "input",
          name: ticketModel.address,
          field: "address",
          placeholder: `请输入${ticketModel.address}模糊查询`
        },
        {
          type: "input",
          name: ticketModel.remark,
          field: "remark",
          placeholder: `请输入${ticketModel.remark}模糊查询`
        }
      ],
      columns: [
        {
          width: 60,
          type: "selection"
        },
        {
          title: ticketModel.sn,
          key: "sn",
          width: 150,
          render: (h, { row }) => {
            return h(
              "a",
              { on: { click: () => this.onShowDetail(row) } },
              row.sn
            );
          }
        },
        {
          title: ticketModel.state,
          key: "state",
          width: 120,
          render: (h, { row }) => {
            return h("Tag", {}, row.tstate.name);
          }
        },
        {
          title: ticketModel.type,
          key: "type",
          width: 140,
          render: (h, { row }) => {
            const type = this.ticket_types.find(t => t.id == row.type);
            return h("div", {}, type ? type.name : "");
          }
        },
        {
          title: ticketModel.address,
          key: "address",
          width: 250
        },
        // {
        //   title: ticketModel.position,
        //   key: 'position',
        //   width: 160
        //   // render: (h, { row }) => {
        //   //   if (row.position) {
        //   //   } else {
        //   //     return h(
        //   //       'a',
        //   //       {
        //   //         on: {
        //   //           click: () => this.onShowMap(row)
        //   //         }
        //   //       },
        //   //       '[ 定位 ]'
        //   //     );
        //   //   }
        //   // }
        // },
        {
          title: ticketModel.remark,
          key: "remark",
          width: 250
        },
        {
          title: ticketModel.live,
          key: "live",
          width: 120,
          render(h, { row }) {
            let v = "-";
            if (row.live == 0) {
              v = "否";
            }
            if (row.live == 1) {
              v = "是";
            }
            return h("div", {}, v);
          }
        },
        {
          title: ticketModel.assignee,
          key: "assignee",
          width: 150,
          render: (h, { row }) => {
            return h("div", {}, row.worker ? row.worker.name : "");
          }
        },
        {
          title: ticketModel.otype,
          key: "otype",
          width: 200
        },
        {
          title: ticketModel.term,
          key: "term",
          width: 200,
          render: (h, { row }) => {
            if (!row.term) {
              return h("div", "-");
            } else
              return h("div", {}, [
                h("Icon", {
                  props: {
                    type: "md-time",
                    size: 14
                  },
                  style: {
                    marginRight: "5px",
                    marginTop: "-3px"
                  }
                }),
                h(
                  "span",
                  {},
                  new Date(row.term * 1000).Format("yyyy-MM-dd HH:mm")
                )
              ]);
          }
        },
        {
          title: ticketModel.uid,
          width: 120,
          render: (h, { row }) => {
            return h("div", {}, row.creator.name);
          }
        },
        {
          title: "操作",
          width: 150,
          fixed: "right",
          align: "center",
          render: (h, { row }) => {
            return h(
              "div",
              row.actions.map(item => {
                return h(
                  "a",
                  {
                    props: {
                      type: "text"
                    },
                    style: {
                      margin: "0 5px"
                    },
                    on: {
                      click: () => this.doAction(row, item)
                    }
                  },
                  item.name
                );
              })
            );
          }
        }
      ],
      localColumns: [],
      query: Query(),
      tickets: {
        total: 0,
        page: 0,
        data: []
      },
      event_stat: {
        status: {}
      },
      showColumn: false,
      service: "ticket",
      dialog: false,
      form: {
        ticket: "",
        action: "",
        assignee: null,
        remark: "",
        fields: []
      },
      ticketModel,
      selectTicket: {
        tstate: {
          roles: []
        }
      },
      ticket_stat: {
        status: {},
        types: []
      },
      selectAction: {
        fields: []
      },
      formLoading: false,
      showMap: false,
      showDetail: false
    };
  },
  apollo: {
    tickets: {
      query: GetTickets,
      fetchPolicy: "network-only",
      variables() {
        return this.query;
      }
    },
    ticket_stat: {
      query: TicketStat,
      fetchPolicy: "network-only",
      variables() {
        return {
          own: this.query.own
        };
      }
    }
  },
  methods: {
    render() {
      this.$apollo.queries.tickets.setVariables(this.query);
      this.$apollo.queries.tickets.refetch();
      this.$apollo.queries.ticket_stat.refetch();
    },
    onPage(page) {
      this.query.page = page.pageNumber;
      this.query.limit = page.pageSize;
      this.render();
    },
    onPageSizeChange(size) {
      this.query.limit = size;
      this.render();
    },
    onExport() {
      this.$refs.xTable.exportCsv({
        filename: "export"
      });
    },
    onShowColumn() {
      this.showColumn = true;
    },
    initColumns() {
      const local = this.$ls.get(this.service, null);
      if (local) {
        this.localColumns = this.columns.filter(column => {
          if (!column.key) {
            return true;
          } else {
            return local.indexOf(column.key) > -1;
          }
        });
      } else {
        this.localColumns = this.columns;
      }
    },
    initQuery() {
      Object.assign(this.query, Query());
    },
    onRefresh() {
      this.initQuery();
      this.render();
    },
    onSelectColumns(columns) {
      this.localColumns = columns;
    },
    showOwn() {
      this.query.own = true;
      this.render();
    },
    onSelectOwn() {
      this.render();
    },
    onSelectStatus(status) {
      this.query.page = 1;
      this.query.status = status.id;
      this.render();
    },

    onFilter(filter) {
      this.initQuery();
      filter.forEach(item => {
        if (item.field == "time") {
          this.query.pstime = moment(item.value[0]).format("YYYY-MM-DD");
          this.query.petime = moment(item.value[1]).format("YYYY-MM-DD");
        } else {
          this.query[item.field] = item.value;
        }
      });
      this.render();
    },
    onOk() {
      if (!this.form.assignee && this.selectAction.name != "结单") {
        return this.$Message.warning("请选择当前工单指派人员！");
      }

      this.$refs.actionForm.valid((valid, fields) => {
        if (valid) {
          this.formLoading = true;
          this.form.fields = fields;
          this.$apollo
            .mutate({
              mutation: TicketAction,
              variables: this.form
            })
            .then(rep => {
              console.log(rep);
              this.formLoading = false;
              this.dialog = false;
              this.$Message.success("操作成功！");
              this.render();
            })
            .catch(err => {
              this.formLoading = false;
              this.$Message.error(err.message);
            });
        }
      });
    },
    onCancel() {
      this.dialog = false;
    },
    doAction(data, action) {
      this.selectTicket = data;
      this.selectAction = action;
      this.form = {
        ticket: data.id,
        action: action.id,
        assignee: null,
        remark: "",
        fields: []
      };
      this.dialog = true;
    },
    onShowMap(row) {
      this.selectTicket = row;
      this.showMap = true;
    },
    onSelectPosition({ lnglat }) {
      this.$apollo
        .mutate({
          mutation: UpdatePosition,
          variables: {
            id: this.selectTicket.id,
            position: lnglat
          },
          client: "gas"
        })
        .then(rep => {
          console.log(rep);
          this.render();
        });
    },
    onShowDetail(row) {
      this.selectTicket = row;
      this.showDetail = true;
    }
  },
  created() {
    this.initQuery();
    this.initColumns();
  }
};
</script>

<style lang="less">
.event-manager {
  height: 100%;
}
</style>
