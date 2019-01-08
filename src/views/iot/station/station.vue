<template>
    <div class="page-station">
        <two-v>
            <x-wrapper
                    slot="top"
                    style="padding-bottom: 0"
                    title="站点"
                    service="station"
                    :model="model"
                    :columns="columns"
                    :rules="rules"
                    :filter="filter"
                    ref="wrapper"
                    @on-row-click="onRowClick"
                    @refresh="onRefresh"
            >
                <div slot="dialog" slot-scope="{ model }">
                    <FormItem :label="stationModel.name" prop="name">
                        <Input v-model="model.name" :placeholder="'请输入'+ stationModel.name"  />
                    </FormItem>
                    <FormItem :label="stationModel.code" >
                        <Input v-model="model.code" :placeholder="'请输入'+ stationModel.code"  />
                    </FormItem>
                    <FormItem :label="stationModel.type" >
                        <Select v-model="model.type" :placeholder="'请选择'+ stationModel.type"  >
                            <Option v-for="s in stationType" :key="s.value" :value="s.value" :label="s.name"></Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="stationModel.area" >
                        <tree-select :treeData="treeData" v-model="model.area" placeholder="请选择区域"></tree-select>
                    </FormItem>
                    <FormItem :label="stationModel.position">
                        <i-input v-model="model.position" readonly placeholder="请选择坐标" >
                            <Button slot="append" @click="onShowMap(model.position, '')">地图</Button>
                        </i-input>
                    </FormItem>
                    <FormItem :label="stationModel.addr" v-show="model.position">
                        <Input v-model="model.addr"  placeholder="请输入地址" />
                    </FormItem>
                    <FormItem :label="stationModel.tag">
                        <Input v-model="model.tag" :placeholder="'请输入'+ stationModel.tag"  />
                    </FormItem>
                    <FormItem :label="stationModel.weight" >
                        <InputNumber  style="width: 100%" :min="0" v-model="model.weight" :placeholder="'请输入'+ stationModel.weight"  />
                    </FormItem>
                    <FormItem :label="stationModel.status">
                        <RadioGroup v-model.number="model.status">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">禁用</Radio>
                        </RadioGroup>
                    </FormItem>

                </div>
                <Button slot="buttons" style="margin-left: 10px" @click="onAddChild"  icon="md-add"  :disabled="!selectId">设备</Button>

            </x-wrapper>
            <device slot="bottom" :sid="selectId"  ref="dictItem"></device>

        </two-v>

        <!--<TabPane closable :label="t.name" v-for="(t, index) in tabs" :name="t.name" :key="index">-->
        <!--<sensor  @on-close="onTabRemove" :tab="t.name" :station="t.station" :device="t.device"></sensor>-->
        <!--</TabPane>-->
        <map-position :position="position" :type="mapType" @on-select="onGetPosition" :show.sync="showMap"></map-position>

        <Modal title='实例化模版' v-model="modelDialog">
            <Select v-model="template" placeholder="请选择模版">
                <Option  v-for="model in models" :key="model.id" :label="model.name" :value="model.id"></Option>
            </Select>
            <div slot="footer">
                <Button @click="modelDialog = false">取消</Button>
                <Button @click="onInitTemplate" type="primary">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import treeSelect from "@/components/treeSelect";
import mapPosition from "@/components/mapPosition";
import types from "@/types";
const { stationModel, newStation } = types;
import Vue from "vue";
const areaIcon = require("@/assets/images/icon/area.png");
import device from "./device";
import areaService from "@/services/area";
import sensor from "./sensor";
import { mapState, mapMutations } from "vuex";
import { InitStation } from "@/graphqls/station.graphql";
export default {
  name: "Dict",
  components: {
    device,
    treeSelect,
    mapPosition,
    sensor
  },
  computed: {
    stationType() {
      if (this.$store.state.common.dicts.length > 0) {
        const dict = this.$store.state.common.dicts.find(d => d.id == "D0002");
        return dict ? dict.values : [];
      } else {
        return [];
      }
    },
    ...mapState(["windowHeight"]),
    ...mapState("common", ["models"])
  },
  data() {
    return {
      stationModel,
      mapType: "",
      position: "",
      selectId: null,
      treeData: [],
      showMap: false,
      columns: [
        {
          width: 40,
          align: "center",
          type: "selection"
        },
        {
          title: stationModel.name,
          key: "name",
          sortable: "custom",
          width: 200
        },
        {
          title: stationModel.type,
          sortable: "custom",
          width: 120,
          render(h, { row }) {
            return h("div", {}, Vue.filter("dict")(row.type, "D0002"));
          }
        },
        {
          title: stationModel.area,
          key: "area",
          width: 150
        },
        {
          title: stationModel.addr,
          key: "addr",
          width: 200
        },
        {
          title: stationModel.position,
          key: "position",
          width: 200,
          render: (h, { row }) => {
            return h(
              row.position ? "a" : "div",
              {
                on: {
                  click: () => {
                    if (row.position) {
                      this.onShowMap(row.position, "simple");
                    }
                  }
                }
              },
              row.position || "-"
            );
          }
        },
        {
          title: stationModel.tag,
          key: "tag",
          width: 150
        },
        {
          title: stationModel.weight,
          key: "weight",
          width: 120,
          sortable: "custom"
        },
        {
          title: stationModel.status,
          key: "status",
          sortable: "custom",
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
          title: "创建时间",
          key: "created",
          sortable: "custom",
          width: 120,
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.created * 1000));
          }
        },
        {
          title: "更新时间",
          key: "changed",
          minWidth: 120,
          sortable: "custom",
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.changed * 1000));
          }
        },
        {
          title: "操作",
          width: 140,
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
                    click: () => this.$refs.wrapper.onEdit(row)
                  }
                },
                "编辑"
              ),
              h(
                "iconButton",
                {
                  props: {
                    icon: "iconfont icon-liebiao1",
                    type: "success",
                    tooltip: "传感器",
                    placement: "top"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      parent.window.eventBus.$emit("add_tab", {
                        text: `【${row.name}】的传感器`,
                        path: "/iot/sensor/" + row.id
                      });
                      // this.onAddTab({
                      //   name: row.name,
                      //   station: row.id,
                      //   device: null
                      // });
                    }
                  }
                },
                "传感器"
              ),
              h(
                "iconButton",
                {
                  props: {
                    icon: "iconfont icon-moban",
                    type: "primary",
                    tooltip: "实例化模版",
                    placement: "top"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.selectId = row.id;
                      this.template = "";
                      this.modelDialog = true;
                    }
                  }
                },
                "实例化"
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
                      this.$refs.wrapper.onDelete(
                        row.id,
                        `确定要删除模版【${row.name}】吗？`
                      )
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      model: newStation,
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }]
      },
      filter: [
        {
          type: "input",
          name: stationModel.name,
          field: "name",
          placeholder: "请输入名称模糊查询"
        }
      ],
      tabs: [],
      activeTab: "list",
      modelDialog: false,
      template: ""
    };
  },
  methods: {
    ...mapMutations("app", ["add_tab"]),
    onRowClick(row) {
      this.selectId = row.id;
    },
    onAddChild() {
      this.$refs["dictItem"].onAdd();
    },
    onRefresh() {
      this.$refs["dictItem"].reset();
      this.selectId = null;
    },
    showSensor(row) {
      this.$emit("add-tab", {
        station: this.parent.id,
        device: row.id,
        name: `${this.parent.name}-${row.name}`
      });
    },
    getTreeData(tableData) {
      this.treeData = [];

      tableData.forEach(item => {
        item.icon = areaIcon;
        item.open = true;
        this.treeData.push(item);
      });
    },
    render() {
      this.loading = true;
      areaService
        .findAll({
          size: 999,
          fields: ["*"],
          orders: ["weight"]
        })
        .then(rep => {
          this.loading = false;
          const tableData = rep.data;
          this.getTreeData(tableData);
        });
    },
    onGetPosition({ address, lnglat }) {
      this.$refs.wrapper.form.addr = address;
      this.$refs.wrapper.form.position = lnglat;
    },
    onAddTab(data) {
      if (!this.tabs.find(t => t.name == data.name)) {
        this.tabs.push(data);
      }
      this.activeTab = data.name;
    },
    onTabRemove(name) {
      this.tabs = this.tabs.filter(t => t.name != name);
      if (this.tabs.length == 0) {
        this.activeTab = "list";
      } else {
        this.activeTab = this.tabs[this.tabs.length - 1]["name"];
      }
    },
    onShowMap(position, type) {
      this.mapType = type;
      this.position = position;
      this.showMap = true;
    },
    onInitTemplate() {
      if (!this.template) return this.$Message.warning("请选择模版!");
      this.$Modal.confirm({
        title: "提示",
        content: `确定对站点【${this.selectId.name}】进行实例化操作？`,
        onOk: () => {
          this.$apollo
            .mutate({
              mutation: InitStation,
              variables: {
                model: this.template,
                station: this.selectId.id
              }
            })
            .then(() => {
              this.modelDialog = false;
              this.$Message.success("操作成功！");
              this.onRefresh();
            });
        }
      });
    }
  },
  mounted() {
    this.render();
  }
};
</script>

<style lang="less">
.page-station {
  height: 100%;
}
</style>
