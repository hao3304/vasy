<template>
    <div class="event-manager">


        <f-panel>
            <div slot="header">
                <x-filter @on-filter="onFilter" :list="filterList">
                    <Button type="primary" @click="onAdd"  style="margin-right: 10px;margin-left: 20px;" icon="md-add" slot="buttons">事件</Button>
                    <Tooltip content="导出" placement="bottom" slot="right-block" style="margin-right: 10px;" >
                        <Button @click="onExport" icon="md-download" style="padding: 5px 8px;"></Button>
                    </Tooltip>
                    <Tooltip content="列设置" placement="bottom" slot="right-block"  style="margin-right: 10px;" >
                        <Button @click="onShowColumn" icon="md-settings" style="padding: 5px 8px;"></Button>
                    </Tooltip>
                    <Tooltip content="刷新" placement="bottom" slot="right-block" style="margin-right: 5px;"  >
                        <Button @click="onRefresh" icon="md-refresh" style="padding: 5px 8px;"></Button>
                    </Tooltip>
                </x-filter>
            </div>
            <div slot="body" slot-scope="props">

                <div style="padding: 10px;">
                    状态：
                    <Button style="margin-right: 10px;" @click="onSelectStatus(s)" :type="query.status == s.id? 'primary': 'default'" v-for="(s, index) in statusList" :key="index">{{s.name}}（{{s.count}}）</Button>
                </div>

                <div class="wrapper-body" style="border-top: 1px solid #ddd;">
                    <Table ref="xTable"
                           :loading="$apollo.queries.events.loading"
                           :highlight-row="true"
                           size="small"
                           :columns="localColumns"
                           border
                           :data="events.data"
                           :height="props.bodyHeight - 39" class="f-table"></Table>
                </div>
                <x-column :name="service" @on-select="onSelectColumns"  :visible.sync="showColumn"  :columns="columns"></x-column>

            </div>
            <div slot="footer">
                <f-page  :total="events.total" @on-page-change="onPage"></f-page>
            </div>
        </f-panel>


        <Modal title="事件管理" fullscreen v-model="eventDialog" >
            <i-form ref="eventForm" :label-width="75" :rules="rules" :model="form">

                <FormItem :label="bizEventModel.time" prop="time">
                    <DatePicker style="width: 100%" type="datetime"  v-model="form.time" format="yyyy-MM-dd HH:mm" :placeholder="'请输入'+ bizEventModel.time"></DatePicker>
                </FormItem>
                <FormItem :label="bizEventModel.category" prop="category">
                    <Select :placeholder="'请选择'+ bizEventModel.category" v-model="form.category"  >
                        <Option v-for="category in eventCates" :key="category.id" :value="category.value" :label="category.name"></Option>
                    </Select>
                </FormItem>
                <FormItem :label="bizEventModel.desc" prop="desc">
                    <Input  v-model="form.desc" type="textarea" :placeholder="'请输入'+ bizEventModel.desc"  />
                </FormItem>
                <FormItem :label="bizEventModel.position">
                    <i-input v-model="form.position" readonly :placeholder="'请输入'+ bizEventModel.position"  >
                <span slot="append">
                <Button @click="showMap = true; mapType = 'create';">选取</Button>
                </span>
                    </i-input>
                </FormItem>
                <FormItem v-show="form.position" :label="bizEventModel.address">
                    <Input v-model="form.address"  :placeholder="'请输入'+ bizEventModel.address"  />
                </FormItem>
                <Row>
                    <i-col :span="12">
                        <FormItem :label="bizEventModel.contact"  prop="contact">
                            <Input  v-model="form.contact" :placeholder="'请输入'+ bizEventModel.contact"  />
                        </FormItem>
                    </i-col>
                    <i-col :span="12">
                        <FormItem :label="bizEventModel.mobile"  prop="mobile">
                            <Input style="width: 100%"  v-model="form.mobile" :placeholder="'请输入'+ bizEventModel.mobile"  />
                        </FormItem>
                    </i-col>
                </Row>
                <FormItem :label="bizEventModel.utype">
                    <Input  v-model="form.utype" :placeholder="'请输入'+ bizEventModel.utype"  />
                </FormItem>
                <Row>
                    <i-col :span="12">
                        <FormItem :label="bizEventModel.usn">
                            <Input  v-model="form.usn" :placeholder="'请输入'+ bizEventModel.usn"  />
                        </FormItem>
                    </i-col>
                    <i-col :span="12">
                        <FormItem :label="bizEventModel.uname">
                            <Input  v-model="form.uname" :placeholder="'请输入'+ bizEventModel.uname"  />
                        </FormItem>
                    </i-col>
                </Row>
                <FormItem :label="bizEventModel.reason">
                    <Input type='textarea' v-model="form.reason" :placeholder="'请输入'+ bizEventModel.reason"  />
                </FormItem>
                <FormItem :label="bizEventModel.remark">
                    <Input type='textarea' v-model="form.remark" :placeholder="'请输入'+ bizEventModel.remark"  />
                </FormItem>
            </i-form>
            <div slot="footer">
                <Button @click="onCancel">取消</Button>
                <Button @click="onOk"  :loading="formLoading" type="primary">确定</Button>
            </div>
        </Modal>

        <Modal title="建单" fullscreen v-model="dialog" >
            <i-form ref="form" :label-width="75" :rules="rules" :model="form">
                <Row>
                    <i-col :span="12">
                        <FormItem style="margin-bottom: 0" label="户名">
                            {{selectEvent.uname}}
                        </FormItem>
                    </i-col>
                    <i-col :span="12">
                        <FormItem style="margin-bottom: 0" label="户号">
                            {{selectEvent.usn}}
                        </FormItem>
                    </i-col>
                    <i-col :span="24">
                        <FormItem style="margin-bottom: 0" label="发生地址">
                            {{selectEvent.address}}
                        </FormItem>
                    </i-col>
                    <i-col :span="24">
                        <FormItem  label="备注信息">
                            {{selectEvent.remark|| '无'}}
                        </FormItem>
                    </i-col>
                </Row>

                <Row>
                    <i-col :span="12">
                        <FormItem :label="ticketModel.type" prop="type">
                            <Select v-model="form.type"  :placeholder="'请选择'+ ticketModel.type" >
                                <Option v-for='t in ticket_types' :label="t.name" :key="t.id" :value="t.id"></Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col :span="10">
                        <FormItem :label="ticketModel.term">
                            <InputNumber style="width: 100%" :min="0" :placeholder="`请输入${ticketModel.term}`" v-model='form.term' />
                        </FormItem>
                    </i-col>
                    <i-col :span="2">
                        <span style="line-height: 32px;padding-left: 4px"> 分钟</span>
                    </i-col>
                </Row>
                <FormItem :label="ticketModel.assignee" v-if="form.type" prop="assignee">
                    <!--<Select v-model="form.assignee">-->
                    <!--<Option v-for="user in users" :label="user.name" :value="user.id"></Option>-->
                    <!--</Select>-->
                    <user-select placeholder="请选择当前工单指派人员" :roles="roles" v-model="form.assignee"></user-select>
                </FormItem>

                <FormItem :label="ticketModel.address">
                    <Input type="textarea" v-model="form.address" :placeholder="'请输入'+ ticketModel.address"  />
                </FormItem>
                <FormItem :label="ticketModel.position">
                    <i-input v-model="form.position" :placeholder="'请输入'+ ticketModel.position"  >
                            <span slot="append">
                                <Button @click="showMap = true; mapType = 'create';">选取</Button>
                            </span>
                    </i-input>
                </FormItem>
                <FormItem :label="ticketModel.desc">
                    <Input type="textarea" v-model="form.desc" :placeholder="'请输入'+ ticketModel.desc"  />
                </FormItem>
                <FormItem :label="ticketModel.remark" >
                    <Input  type="textarea" v-model="form.remark" :placeholder="'请输入'+ ticketModel.remark"  />
                </FormItem>
            </i-form>
            <div slot="footer">
                <Button @click="onCancel">取消</Button>
                <Button @click="onSubmit"  :loading="formLoading" type="primary">确定</Button>
            </div>
        </Modal>

        <map-position @on-select="onGetPosition" :position="position" :type="mapType" :show.sync="showMap"></map-position>
    </div>
</template>

<script>
import xFilter from "@/components/FFilter";
import xColumn from "@/components/xColumn";
import types from "@/types";
const { bizEventModel, ticketModel } = types;
import {
  GetEvents,
  GetEventStat,
  Hello,
  UpdatePosition,
  EventCreate,
  EventUpdate,
  EventDelete
} from "@/graphqls/event.graphql";
import { TicketCreate } from "@/graphqls/ticket.graphql";
import { mapState } from "vuex";
import Vue from "vue";
import moment from "moment";
import mapPosition from "@/components/mapPosition";
import { GetUsers } from "@/graphqls/user.graphql";
const Query = () => {
  return {
    limit: 20,
    page: 1,
    count: true,
    orders: ["-time"],
    status: null,
    address: null,
    pstime: null,
    petime: null,
    remark: null
  };
};

const newEvent = () => {
  return {
    time: "",
    category: "",
    desc: "",
    address: "",
    position: "",
    remark: "",
    contact: "",
    mobile: "",
    utype: "",
    usn: "",
    uname: "",
    reason: ""
  };
};

const newTicket = () => {
  return {
    otype: "",
    oid: "",
    type: "",
    desc: "",
    remark: "",
    term: null,
    address: "",
    live: 0,
    position: "",
    assignee: ""
  };
};

export default {
  name: "event",
  components: {
    xFilter,
    xColumn,
    mapPosition
  },
  watch: {
    "form.type"() {
      if (this.form.type) {
        this.queryUser(this.form.type);
      }
    }
  },
  computed: {
    ...mapState(["windowHeight"]),
    ...mapState("common", ["eventStatus", "ticket_types", "dicts"]),
    statusList() {
      if (Object.keys(this.event_stat.status).length > 0) {
        let list = JSON.parse(JSON.stringify(this.eventStatus));

        let total = 0;
        Object.keys(this.event_stat.status).forEach(item => {
          if (item != "__typename") {
            total += this.event_stat.status[item];
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
            count: item.id == null ? total : this.event_stat.status[item.id]
          };
        });
      } else {
        return [];
      }
    },
    eventCates() {
      const target = this.dicts.find(dict => dict.id == "D0011");
      return target ? target.values : [];
    }
  },
  data() {
    return {
      mode: "综合查询",
      position: "",
      ticketModel,
      filterList: [
        {
          type: "date",
          name: bizEventModel.time,
          field: "time",
          placeholder: `请选择${bizEventModel.time}范围`
        },
        {
          type: "input",
          name: bizEventModel.address,
          field: "address",
          placeholder: `请输入${bizEventModel.address}模糊查询`
        },
        {
          type: "input",
          name: bizEventModel.remark,
          field: "remark",
          placeholder: `请输入${bizEventModel.remark}模糊查询`
        }
      ],
      columns: [
        {
          width: 40,
          align: "center",
          type: "selection"
        },
        {
          title: bizEventModel.time,
          key: "time",
          width: 150,
          sortable: "custom",
          render: (h, { row }) => {
            return h(
              "div",
              {},
              Vue.filter("dateFormat")(row.time * 1000, "YYYY-MM-DD hh:mm")
            );
          }
        },
        {
          title: bizEventModel.category,
          key: "category",
          width: 120
        },
        {
          title: bizEventModel.address,
          key: "address",
          width: 240,
          render: (h, { row }) => {
            if (row.position) {
              return h(
                "a",
                {
                  on: {
                    click: () => {
                      this.position = row.position;
                      this.onShowMap(row);
                      this.mapType = "simple";
                    }
                  }
                },
                row.address
              );
            } else {
              return h("div", {}, [
                h("span", {}, row.address),
                h(
                  "a",
                  {
                    on: {
                      click: () => {
                        this.position = "";
                        this.onShowMap(row);
                        this.mapType = "update";
                      }
                    }
                  },
                  "【定位】"
                )
              ]);
            }
          }
        },
        // {
        //   title: bizEventModel.position,
        //   key: 'position',
        //   width: 180,
        //   render: (h, { row }) => {
        //     if (row.position) {
        //       return h('a', {}, `[${row.position}]`);
        //     } else {
        //       return h(
        //         'a',
        //         {
        //           on: {
        //             click: () => {
        //               this.onShowMap(row);
        //               this.mapType = 'update';
        //             }
        //           }
        //         },
        //         '[ 定位 ]'
        //       );
        //     }
        //   }
        // },
        {
          title: bizEventModel.mobile,
          key: "mobile",
          width: 150
        },
        {
          title: bizEventModel.utype,
          key: "utype",
          width: 100
        },
        {
          title: bizEventModel.usn,
          key: "usn",
          width: 160
        },
        {
          title: bizEventModel.uname,
          key: "uname",
          width: 120
        },
        {
          title: bizEventModel.rdep,
          key: "rdep",
          width: 150
        },
        {
          title: bizEventModel.remark,
          key: "remark",
          minWidth: 200
        },
        {
          title: "操作1",
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
                    click: () => {
                      this.onEdit(row);
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
                      this.$Modal.confirm({
                        title: "提示",
                        content: "确定删除该事件？",
                        onOk: () => {
                          this.$apollo
                            .mutate({
                              client: "line",
                              mutation: EventDelete,
                              variables: {
                                id: row.id
                              }
                            })
                            .then(rep => {
                              this.render();
                              this.$Message.success("删除成功！");
                            });
                        }
                      })
                  }
                },
                "删除"
              )
            ]);
          }
        },
        {
          title: "操作2",
          width: 120,
          fixed: "right",
          align: "center",
          render: (h, { row }) => {
            return !row.ticket
              ? h("div", [
                  h(
                    "a",
                    {
                      on: {
                        click: () => this.addTicket(row)
                      }
                    },
                    "建单"
                  )
                ])
              : "";
          }
        }
      ],
      localColumns: [],
      query: Query(),
      events: {
        total: 0,
        page: 0,
        data: []
      },
      event_stat: {
        status: {}
      },
      showColumn: false,
      service: "event",
      dialog: false,
      eventDialog: false,
      form: newEvent(),
      bizEventModel,
      rules: {
        time: [
          { required: true, type: "date", message: "必填", trigger: "change" }
        ],
        category: [{ required: true, message: "必选", trigger: "change" }],
        desc: [{ required: true, message: "必选", trigger: "change" }],
        address: [{ required: true, message: "必选", trigger: "change" }],
        contact: [{ required: true, message: "必选", trigger: "change" }],
        mobile: [{ required: true, message: "必选", trigger: "change" }]
      },
      selectEvent: {},
      formLoading: false,
      showMap: false,
      mapType: "", // update / create
      roles: [],
      action: "add"
    };
  },
  apollo: {
    events: {
      client: "line",
      query: GetEvents,
      fetchPolicy: "network-only",
      variables() {
        return this.query;
      }
    },
    event_stat: {
      client: "line",
      query: GetEventStat,
      fetchPolicy: "network-only"
    }
    // $subscribe: {
    //   M: {
    //     query: Hello,
    //     client: 'ws',
    //     result(data) {
    //       // console.log(data);
    //     }
    //   }
    // }
  },
  methods: {
    render() {
      this.$apollo.queries.events.setVariables(this.query);
      this.$apollo.queries.events.refetch();
    },
    onAdd() {
      this.eventDialog = true;
      this.$refs.eventForm.resetFields();
      this.action = "add";
      this.form = newEvent();
      this.form.time = new Date();
    },
    onEdit(row) {
      this.eventDialog = true;
      this.$refs.eventForm.resetFields();
      this.action = "edit";
      Object.assign(this.form, row);
      this.form.time = new Date(row.time * 1000);
      this.selectEvent = row;
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
    onSelectStatus(status) {
      this.query.page = 1;
      this.query.status = status.id;
      this.render();
    },
    addTicket(row) {
      this.selectEvent = row;
      this.$refs.form.resetFields();
      this.form = newTicket();
      this.form.desc = row.remark;
      this.form.address = row.address;
      this.dialog = true;
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
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formLoading = true;
          if (this.action == "add") {
            const params = JSON.parse(JSON.stringify(this.form));
            params.time = parseInt(this.form.time.valueOf() / 1000);
            this.$apollo
              .mutate({
                mutation: EventCreate,
                client: "line",
                variables: params
              })
              .then(rep => {
                console.log(rep);
                this.formLoading = false;
                this.eventDialog = false;
                this.$Message.success("创建成功！");
                this.render();
              })
              .catch(err => {
                this.formLoading = false;
                this.$Message.error(err.message);
              });
          } else {
            const params = JSON.parse(JSON.stringify(this.form));
            params.time = parseInt(this.form.time.valueOf() / 1000);
            params.id = this.selectEvent.id;
            this.$apollo
              .mutate({
                mutation: EventUpdate,
                client: "line",
                variables: params
              })
              .then(rep => {
                console.log(rep);
                this.formLoading = false;
                this.eventDialog = false;
                this.$Message.success("更新成功！");
                this.render();
              })
              .catch(err => {
                this.formLoading = false;
                this.$Message.error(err.message);
              });
          }
        }
      });
    },
    onCancel() {
      this.dialog = false;
      this.eventDialog = false;
    },
    onGetPosition(info) {
      if (this.mapType == "create") {
        this.form.position = info.lnglat;
        if (!this.form.address) {
          this.form.address = info.address;
        } else if (this.form.address != info.address) {
          setTimeout(() => {
            this.$Modal.confirm({
              title: "提示",
              content: `
            <h3>选取的地址与当前工单地址不一致，需要替换吗？</h3>
            <h5 style="color: #333;font-weight: bold">"${
              this.form.address
            }"</h5>
            <span style="font-size: 12px;">替换为</span>
            <h5 style="color: #333;font-weight: bold">"${info.address}"</h5>
          `,
              onOk: () => {
                this.form.address = info.address;
              }
            });
          }, 400);
        }
      } else {
        this.$apollo
          .mutate({
            mutation: UpdatePosition,
            variables: {
              id: this.selectEvent.id,
              position: info.lnglat
            },
            client: "line"
          })
          .then(rep => {
            console.log(rep);
            this.render();
          });
      }
    },
    onShowMap(row) {
      this.selectEvent = row;
      this.showMap = true;
    },
    queryUser(type) {
      const t = this.ticket_types.find(t => t.id == type);
      this.roles = t.sstate.roles;
      // this.form.assignee = '';
      // this.$apollo
      //   .query({
      //     query: GetUsers,
      //     fetchPolicy: 'network-only',
      //     variables: {
      //       roles: roles,
      //       count: false,
      //       limit: 999,
      //       page: 1,
      //       orders: ['id']
      //     }
      //   })
      //   .then(rep => {
      //     this.users = rep.data.users.data;
      //   });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formLoading = true;
          this.$apollo
            .mutate({
              mutation: TicketCreate,
              variables: {
                otype: "biz_event",
                oid: this.selectEvent.id,
                type: this.form.type,
                desc: this.form.desc,
                remark: this.form.remark,
                term: this.form.term,
                live: this.form.live,
                address: this.form.address,
                position: this.form.position,
                assignee: this.form.assignee
              }
            })
            .then(rep => {
              console.log(rep);
              this.formLoading = false;
              this.dialog = false;
              this.$Message.success("派单成功！");
              this.render();
            })
            .catch(err => {
              this.formLoading = false;
              this.$Message.error(err.message);
            });
        }
      });
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
