<template>
    <div class="page-station-list">
        <Spin fix v-show="loading"></Spin>
        <div class="page-station-list__tree">
            <div id="areaTree" class="ztree"></div>
        </div>
        <div class="page-station-list__main">
            <x-filter @on-filter="onFilter" :list="filterList">
                <!--<Button type="primary" @click="onAdd"  style="margin-right: 10px;margin-left: 20px;" icon="md-add" slot="buttons">创建工单</Button>-->
                <Tooltip content="刷新" placement="bottom" slot="right-block"   >
                    <Button @click="onRefresh" icon="md-refresh" style="padding: 5px 8px;"></Button>
                </Tooltip>
            </x-filter>
            <div class="page-station-list__content item" :style="{height: windowHeight - 235 + 'px'}" style="overflow-y: scroll;overflow-x: hidden">
                <Row :gutter="10" >
                    <i-col :span="6" v-for="station in stations" :key="station.id" style="margin-bottom: 10px">
                        <table class="item__header">
                            <tr>
                                <td>
                                    {{station.name}}
                                    <span class="item__header-time">{{station.time | up-time}}</span>
                                </td>
                            </tr>
                        </table>
                        <template v-if="station.devices.length > 0">

                            <table class="item__device">
                                <tr v-for="(device, index) in station.devices" :key="device.id">
                                    <td class="name">
                                        {{device.name}}
                                    </td>
                                    <td class="value">

                                        <table class="item__sensor">
                                            <tr v-for="sensor in device.sensors" :key="sensor.id">
                                                <td class="name">
                                                    {{sensor.name}}
                                                </td>
                                                <td class="value">
                                                    {{sensor.value | toFixed(sensor.unit)}}
                                                </td>
                                                <td class="unit">
                                                    {{sensor.value | unit(sensor.unit)}}
                                                </td>
                                            </tr>
                                            <tr v-if="index == station.devices.length - 1" v-for="n in getLeftRow(station)" :key="n">
                                                <td class="name">&nbsp;</td>
                                                <td class="value"></td>
                                                <td class="unit"></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </template>
                        <template v-else>
                            <table class="item__sensor">
                                <tr v-for="sensor in station.sensors" :key="sensor.id">
                                    <td style="border: 1px solid #ddd;width: 68px;" class="name">
                                        {{sensor.name}}
                                    </td>
                                    <td  style="border: 1px solid #ddd;border-right: none;" class="value">
                                        {{sensor.value | toFixed(sensor.unit)}}
                                    </td>
                                    <td  style="border: 1px solid #ddd;border-left: none;width: 40px;" class="unit">
                                        {{sensor.value | unit(sensor.unit)}}
                                    </td>
                                </tr>

                            </table>
                        </template>
                    </i-col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
import { GetStations } from "@/graphqls/station.graphql";
import types from "@/types";
const { stationModel } = types;
import { mapState } from "vuex";
import areaService from "@/services/area";
const areaIcon = require("@/assets/images/icon/area.png");
const allIcon = require("@/assets/images/icon/all.png");
export default {
  name: "station_list",
  data() {
    return {
      stations: [],
      loading: true,
      filterList: [
        {
          type: "input",
          name: stationModel.name,
          field: "name",
          placeholder: "请输入名称模糊查询"
        }
      ],
      query: {
        limit: 999,
        page: 1,
        count: false,
        name: null,
        orders: ["weight"],
        areas: null
      },
      maxRow: 0,
      treeData: []
    };
  },
  computed: {
    ...mapState(["windowHeight"])
  },
  methods: {
    render() {
      this.loading = true;
      this.$apollo
        .query({
          query: GetStations,
          variables: this.query,
          fetchPolicy: "network-only"
        })
        .then(rep => {
          this.loading = false;
          this.stations = rep.data.stations.data;
          this.getMaxRow();
        });
    },
    getMaxRow() {
      this.stations.forEach(station => {
        let row = 0;
        station.devices.forEach(device => {
          row += device.sensors.length;
        });

        this.maxRow = this.maxRow < row ? row : this.maxRow;
      });
    },
    getLeftRow(station) {
      let row = 0;
      station.devices.forEach(device => {
        row += device.sensors.length;
      });
      let r = this.maxRow - row;
      return r < 0 ? 0 : r;
    },
    onFilter(filter) {
      if (filter.length > 0) {
        this.query.name = filter[0].value;
      } else {
        this.query.name = null;
      }
      this.render();
    },
    onRefresh() {
      this.render();
    },
    getTree() {
      areaService
        .findAll({
          size: 999,
          fields: ["*"],
          orders: ["weight"]
        })
        .then(rep => {
          this.getTreeData(rep.data);
          if (rep.data.length > 0) {
            this.renderTree();
          }
        });
    },
    renderTree() {
      const self = this;
      const setting = {
        data: {
          simpleData: {
            enable: true,
            pIdKey: "parent"
          }
        },
        view: {
          showIcon: true
        },
        callback: {
          onClick: (e, type, node) => {
            const area = self.$treeObj.transformToArray(node);
            this.query.areas = area[0].id == null ? null : [area[0].id];
            this.render();
          }
        }
      };
      this.$treeObj = $.fn.zTree.init($("#areaTree"), setting, this.treeData);
    },
    getTreeData(tableData) {
      this.treeData = [
        {
          id: null,
          parent: null,
          name: "根节点",
          icon: allIcon,
          open: true
        }
      ];

      tableData.forEach(item => {
        item.icon = areaIcon;
        item.open = true;
        this.treeData.push(item);
      });
    }
  },
  mounted() {
    this.render();
    this.getTree();
  }
};
</script>

<style lang="less">
.page-station-list {
  display: flex;
  height: 100%;
  &__tree {
    background: #fff;
    border-right: 1px solid #ddd;
    position: relative;
    height: 100%;
    width: 220px;
    padding: 5px;
  }
  &__main {
    flex: 1;
    overflow: hidden;
    padding: 10px 15px;
  }

  &__content {
    margin-top: 10px;
  }

  .item {
    &__header {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #333;
      background-color: #7354cc;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
      td {
        color: #fff;
        font-size: 14px;
        padding: 2px 5px;
      }

      &-time {
        float: right;
        font-size: 12px;
        margin-top: 2px;
      }
    }
    &__device {
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      width: 100%;
      border-collapse: collapse;
      td {
        border: 1px solid #ddd;
        background-color: #fff;
      }
      td.value {
        background-color: #fff;
      }

      td.name {
        width: 68px;
        text-align: center;
        color: #4b596b;
        text-decoration: underline;
      }

      .item__sensor {
        td.name {
          border-left: none;
          text-decoration: none;
        }
        tr:first-child td {
          border-top: none;
        }
        tr:last-child td {
          border-bottom: none;
        }
      }
    }

    &__sensor {
      border-collapse: collapse;
      width: 100%;
      background-color: #fff;
      td {
        padding: 2px 5px;
      }
      td.name {
        text-align: left;
        color: #666;
      }
      td.unit {
        width: 40px;
        background-color: #fff;
        border-left: none;
        border-right: none;
      }
      td.value {
        border-right: none;
        padding-left: 10px;
        color: #333;
        font-weight: bolder;
      }
    }
  }
}
</style>
