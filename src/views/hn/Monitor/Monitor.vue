<template>
  <div class="page-monitor">
    <f-layout-panel>
      <div slot="left" style="overflow-x: auto;height: 100%">
        <div class="page-monitor__tree ztree" ref="tree"></div>
      </div>
        <f-panel slot="right">
          <div slot="header">
            <f-filter :list="filter" @on-filter="onFilter" >
              <ButtonGroup slot="buttons" >
                <Button @click="mode = 'list'" :type="mode=='list'?'primary':'default'" >
                  <Icon custom="iconfont icon-liebiao"  style="margin-top: -3px"></Icon>
                </Button>
                <Button @click="mode = 'map'"  :type="mode=='map'?'primary':'default'"  >
                  <Icon custom="iconfont icon-ditu1"  style="margin-top: -3px"></Icon>
                </Button>
              </ButtonGroup>
            </f-filter>
          </div>
          <div slot="body" slot-scope="props">
            <Table  v-show="mode == 'list'" class="f-table" :columns="columns" :loading="loading" :height="props.bodyHeight" :data="tableData" size="small" border></Table>
            <station-map  v-show="mode == 'map'" :show="mode == 'map'" :height="props.bodyHeight"></station-map>
          </div>
          <div slot="footer" v-show="mode == 'list'">
            <f-page  :total="total" @on-page-change="onPageChange"></f-page>
          </div>
        </f-panel>
    </f-layout-panel>

  </div>
</template>

<script>
import Detail from "./Detail";
import { mapState, mapMutations } from "vuex";
import { GetStations } from "@/graphqls/station.graphql";
const allIcon = require("@/assets/images/icon/all.png");
import StationMap from "./Map";
export default {
  components: { StationMap },
  data() {
    return {
      mode: "list",
      columns: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            return h(Detail, {
              props: {
                data: params.row.sensors
              }
            });
          }
        },
        {
          title: "站点名称",
          key: "name",
          render: (h, { row }) => {
            return h("a", row.name);
          }
        },
        {
          title: "上传时间",
          key: "time",
          render(h, { row }) {
            return h("div", {}, Vue.filter("up-time")(row.time));
          }
        },
        {
          title: "瞬时流量（T/h）",
          key: "SSLL",
          render(h, { row }) {
            const sensor = row.sensors.find(s => s.unit == "SSLL");
            return h(
              "div",
              {},
              sensor ? Vue.filter("toFixed")(sensor.value, "SSLL") : "-"
            );
          }
        },
        {
          title: "累计流量（T）",
          key: "SJLJ",
          render(h, { row }) {
            const sensor = row.sensors.find(s => s.unit == "SJLJ");
            return h(
              "div",
              {},
              sensor ? Vue.filter("toFixed")(sensor.value, "SJLJ") : "-"
            );
          }
        },
        {
          title: "压力（MPa）",
          key: "YL",
          render(h, { row }) {
            const sensor = row.sensors.find(s => s.unit == "YL");
            return h(
              "div",
              {},
              sensor ? Vue.filter("toFixed")(sensor.value, "YL") : "-"
            );
          }
        },
        {
          title: "温度（℃）",
          key: "WD",
          render(h, { row }) {
            const sensor = row.sensors.find(s => s.unit == "WD");
            return h(
              "div",
              {},
              sensor ? Vue.filter("toFixed")(sensor.value, "WD") : "-"
            );
          }
        },
        {
          title: "卡内余额（元）",
          key: "KY",
          render(h, { row }) {
            const sensor = row.sensors.find(s => s.unit == "KY");
            return h(
              "div",
              {},
              sensor ? Vue.filter("toFixed")(sensor.value, "KY") : "-"
            );
          }
        },
        {
          title: "阀门",
          key: "fm",
          render(h, { row }) {
            const v1 = row.sensors.find(s => s.name == "阀门开到位");
            const v2 = row.sensors.find(s => s.name == "阀门关到位");
            return h("div", {}, Vue.filter("fm")(v1, v2));
          }
        },
        {
          title: "操作",
          width: 120,
          align: "center",
          render: (h, { row }) => {
            return h("div", {}, [
              // h("Icon", {
              //   props: {
              //     custom: "iconfont icon-shoucang1",
              //     size: 18
              //   },
              //   style: {
              //     color: "#0072ca",
              //     marginRight: "8px"
              //   }
              // }),
              h("Icon", {
                props: {
                  type: "md-podium",
                  size: 20
                },
                style: {
                  color: "#0072ca",
                  marginRight: "5px",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    this.set_right(true);
                    this.set_right_active(2);
                    this.set_monitor_station(row.id);
                  }
                }
              }),
              h("Icon", {
                props: {
                  type: "md-more",
                  size: 20
                },
                style: {
                  color: "#0072ca"
                }
              })
            ]);
          }
        }
      ],
      loading: false,
      query: {
        limit: 20,
        page: 1
      },
      total: 0,
      where: {
        name: null,
        areas: null
      },
      filter: [
        {
          type: "input",
          name: "名称",
          field: "name",
          placeholder: "请输入名称模糊查询"
        }
      ],
      filterLength: 0
    };
  },
  computed: {
    ...mapState("monitor", ["stations"]),
    ...mapState("common", ["areas"]),
    tableData() {
      return this.stations.slice(
        (this.query.page - 1) * this.query.limit,
        this.query.page * this.query.limit
      );
    }
  },
  watch: {
    areas() {
      this.renderTree();
    }
  },
  methods: {
    ...mapMutations("monitor", [
      "set_right_active",
      "set_stations",
      "set_monitor_station",
      "set_right"
    ]),
    render() {
      this.loading = true;
      this.$apollo
        .query({
          query: GetStations,
          variables: {
            limit: 999,
            page: 1,
            orders: ["id"],
            count: true,
            name: this.where.name,
            areas: this.where.areas
          },
          fetchPolicy: "network-only"
        })
        .then(({ data }) => {
          this.set_stations(data.stations.data);
          this.total = data.stations.total;
          this.loading = false;
        });
    },
    renderTree() {
      const setting = {
        callback: {
          onClick: (e, type, node) => {
            this.where.areas = node.id == 0 ? null : [node.id];
            this.render();
          }
        }
      };
      const treeData = [
        {
          id: null,
          name: "全部区域",
          icon: allIcon,
          open: true,
          children: this.areas
        }
      ];

      $.fn.zTree.init($(this.$refs.tree), setting, treeData);
    },
    onPageChange(e) {
      this.query.limit = e.pageSize;
      this.query.page = e.pageNumber;
    },
    onFilter(filter) {
      if (filter.length > 0) {
        this.where.name = filter[0].value;
      } else {
        this.where.name = null;
      }
      this.render();
    }
  },
  mounted() {
    this.render();
  }
};
</script>
<style lang="less">
.page-monitor {
  height: 100%;
  overflow: hidden;
  background-color: #fafafa;

  .toolbar {
    line-height: 37px;
    border-bottom: 1px solid #ddd;
  }
}
</style>
