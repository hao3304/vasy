<template>
    <div style="padding: 10px 20px;">
        <Tabs type="card" v-model="activeTab" @on-tab-remove="onTabRemove">
            <TabPane label="区域列表" name="home">
                <div class="page-video">
                    <div class="page-video__tree" :style="{height: windowHeight- 222 + 'px'}" >
                        <not-find @click="onAdd" v-if="!loading&&tableData.length == 0"></not-find>
                        <div id="areaTree" class="ztree" v-else></div>
                    </div>
                    <div class="page-video__main">
                        <x-wrapper
                                style="padding-top: 0px;padding-right: 0"
                                title="视频区域"
                                service="video"
                                :columns="columns"
                                :model="model"
                                :rules="rules"
                                :filter="filter"
                                ref="wrapper"
                                :height="windowHeight- 350"
                                :loads="true"
                                :orders="['id']"
                                @on-save="render"
                                @on-update="render"
                                @on-delete="render"
                                @refresh="render"
                        >
                            <div slot="dialog" slot-scope="{ model }">
                                <FormItem :label="videoModel.name" prop="name">
                                    <Input placeholder="请输入区域名称" v-model="model.name" />
                                </FormItem>
                                <FormItem :label="videoModel.type"  prop="type">
                                    <Select v-model="model.type" placeholder="请选择区域类型">
                                        <Option v-for="t in types" :key="t.value" :label="t.name" :value="t.value"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem :label="videoModel.parent" >
                                    <tree-select :treeData="treeData" v-model="model.parent" placeholder="请选择上级区域(默认根目录)"></tree-select>
                                </FormItem>
                                <FormItem :label="videoModel.position">
                                    <Input v-model="model.position" readonly placeholder="请选择视频位置" >
                                        <Button slot="append" @click="mapType='';onShowMap(model.position);">地图</Button>
                                    </Input>
                                </FormItem>
                                <FormItem :label="videoModel.weight" >
                                    <InputNumber  style="width: 100%" :min="0" v-model="model.weight" :placeholder="'请输入'+ videoModel.weight"  />
                                </FormItem>
                                <FormItem :label="videoModel.status">
                                    <RadioGroup v-model.number="model.status">
                                        <Radio :label="1">启用</Radio>
                                        <Radio :label="0">禁用</Radio>
                                    </RadioGroup>
                                </FormItem>

                            </div>
                        </x-wrapper>

                        <map-position  :type="mapType" :position="position"   @on-select="onGetPosition" :show.sync="showMap"></map-position>
                    </div>
                </div>
            </TabPane>
            <TabPane closable v-for="t in tabs" :label="t.name" :key="t.id" :name="t.id">
                <video-stream @on-close="onTabRemove" :video="t.id"></video-stream>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import types from "@/types";
import Vue from "vue";
const areaIcon = require("@/assets/images/icon/video.png");
const allIcon = require("@/assets/images/icon/all.png");
const { newVideo, videoModel } = types;
import treeSelect from "@/components/treeSelect";
import videoService from "@/services/video";
import { mapState } from "vuex";
import notFind from "@/components/notFind";
import videoStream from "./video_stream";
export default {
  data() {
    return {
      dialog: false,
      formLoading: false,
      loading: false,
      showMap: false,
      activeTab: "",
      mapType: "simple",
      position: "",
      tabs: [],
      columns: [
        {
          width: 60,
          type: "selection"
        },
        {
          title: videoModel.name,
          key: "name",
          sortable: "custom",
          width: 200
        },
        {
          title: videoModel.type,
          key: "type",
          sortable: "custom",
          width: 120,
          render(h, { row }) {
            return h("div", {}, Vue.filter("dict")(row.type, "D0005"));
          }
        },
        {
          title: videoModel.parent,
          key: "parent",
          render: (h, { row }) => {
            const target = this.tableData.find(d => d.id == row.parent);
            return h("div", {}, target ? target.name : "根节点");
          },
          width: 150
        },
        {
          title: videoModel.position,
          key: "position",
          width: 200,
          render: (h, { row }) => {
            return h(
              row.position ? "a" : "div",
              {
                on: {
                  click: () => {
                    if (row.position) {
                      this.mapType = "simple";
                      this.onShowMap(row.position);
                    }
                  }
                }
              },
              row.position || "-"
            );
          }
        },
        {
          title: videoModel.status,
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
          },
          width: 100
        },
        {
          title: videoModel.weight,
          key: "weight",
          sortable: "custom",
          width: 100
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
          key: "changed",
          minWidth: 150,
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
                    icon: "iconfont icon-video-channel",
                    type: "primary",
                    tooltip: "视频流码",
                    placement: "top"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => this.onAddTab(row)
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
                      this.$refs.wrapper.onDelete(
                        row.id,
                        `确定要删除区域【${row.name}】吗？`
                      )
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableData: [],
      treeData: [],
      action: null,
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        type: [{ required: true, message: "必选", trigger: "change" }]
      },
      form: newVideo(),
      model: newVideo,
      videoModel: videoModel,
      filter: [
        {
          name: "区域名称",
          type: "input",
          field: "name",
          placeholder: "请输入区域名称模糊查询"
        }
      ]
    };
  },
  components: {
    treeSelect,
    notFind,
    videoStream
  },
  computed: {
    ...mapState(["windowHeight"]),
    types() {
      if (this.$store.state.common.dicts.length > 0) {
        return this.$store.state.common.dicts.find(d => d.id == "D0005")[
          "values"
        ];
      } else {
        return [];
      }
    }
  },
  methods: {
    onRefresh() {},
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
            const list = self.$treeObj.transformToArray(node);
            self.$refs.wrapper.doFilter({
              op: "in",
              field: "id",
              args: list.map(l => l.id)
            });
          }
        }
      };
      this.$treeObj = $.fn.zTree.init($("#areaTree"), setting, this.treeData);
    },
    getTreeData() {
      this.treeData = [
        {
          id: null,
          parent: null,
          name: "根节点",
          icon: allIcon,
          open: true
        }
      ];

      this.tableData.forEach(item => {
        item.icon = areaIcon;
        item.open = true;
        this.treeData.push(item);
      });
    },
    render() {
      this.loading = true;
      videoService
        .findAll({
          size: 999,
          fields: ["*"],
          orders: ["weight"]
        })
        .then(rep => {
          this.loading = false;
          this.tableData = rep.data;
          this.getTreeData();
          if (rep.data.length > 0) {
            this.renderTree();
          }
        });
    },
    onAdd() {
      this.$refs.wrapper.onAdd();
    },
    onGetPosition({ lnglat }) {
      this.$refs.wrapper.form.position = lnglat;
    },
    onTabRemove(id) {
      this.tabs = this.tabs.filter(t => t.id != id);
      if (this.tabs.length == 0) {
        this.activeTab = "home";
      } else {
        this.activeTab = this.tabs[this.tabs.length - 1]["id"];
      }
    },
    onAddTab(data) {
      if (!this.tabs.find(t => t.id == data.id)) {
        this.tabs.push(data);
      }
      this.activeTab = data.id;
    },
    onShowMap(position) {
      this.showMap = true;
      this.position = position;
    }
  },
  mounted() {
    this.render();
  }
};
</script>
<style lang="less">
.page-video {
  display: flex;
  height: 100%;

  &__tree {
    background: #fff;
    border-right: 1px solid #ddd;
    position: relative;
    min-width: 250px;
    padding: 5px;
  }
  &__main {
    flex: 1;
    overflow: hidden;
    min-width: 1000px;
  }
}
</style>
