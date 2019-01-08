<template>
    <div class="page-video-stream">

        <div class="page-video-stream__header">
            <Button icon="md-close" @click="onClose">关闭</Button>
            <Button type="primary" @click="onAdd"  style="margin-left: 10px;" icon="md-add">新增</Button>
        </div>
        <div class="page-video-stream__body wrapper-body">
            <Table :columns="columns" :data="tableData" :loading="loading" :height="500" class="x-table">
            </Table>
        </div>

        <Modal
                v-model="dialog"
                :title="action == 'add'?'新增视频码流': '编辑视频码流'"
                :width="windowHeight - 300"

        >
            <Form ref="form" :label-width="75" :rules="rules" :model="model">
                <FormItem :label="videoStreamModel.name" prop="name">
                    <Input v-model="model.name" :placeholder="'请输入'+ videoStreamModel.name"  />
                </FormItem>
                <FormItem :label="videoStreamModel.type" >
                    <Select v-model="model.type" :placeholder="'请选择'+ videoStreamModel.type"  >
                        <Option value="hls" label="hls"></Option>
                        <Option value="rtsp" label="rtsp"></Option>
                    </Select>
                </FormItem>

                <FormItem :label="videoStreamModel.main" >
                    <Input v-model="model.main" :placeholder="'请输入'+ videoStreamModel.main"  />
                </FormItem>
                <FormItem :label="videoStreamModel.sub" >
                    <Input v-model="model.sub" :placeholder="'请输入'+ videoStreamModel.sub"  />
                </FormItem>
                <FormItem :label="videoStreamModel.position">
                    <Input v-model="model.position" readonly placeholder="请选择视频位置" >
                        <Button slot="append" @click="mapType='';onShowMap(model.position);">地图</Button>
                    </Input>
                </FormItem>
                <FormItem :label="videoStreamModel.weight" >
                    <InputNumber  style="width: 100%" :min="0" v-model="model.weight" :placeholder="'请输入'+ videoStreamModel.weight"  />
                </FormItem>
                <FormItem :label="videoStreamModel.status">
                    <RadioGroup v-model.number="model.status">
                        <Radio :label="1">启用</Radio>
                        <Radio :label="0">禁用</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="onCancel">取消</Button>
                <Button @click="onOk" type="primary"  :loading="formLoading">确定</Button>
            </div>
        </Modal>
        <map-position  :type="mapType" :position="position"   @on-select="onGetPosition" :show.sync="showMap"></map-position>
    </div>
</template>
<script>
import types from "@/types";
const { videoStreamModel, newVideoStream } = types;
import { mapState } from "vuex";
import videoStreamService from "@/services/video_stream";
import Vue from "vue";
export default {
  props: ["video"],
  computed: {
    ...mapState("common", ["units"]),
    ...mapState(["windowHeight"])
  },
  data() {
    return {
      treeData: [],
      columns: [
        {
          width: 60,
          type: "selection"
        },
        {
          title: videoStreamModel.name,
          width: 150,
          key: "name",
          sortable: "custom"
        },
        {
          title: videoStreamModel.type,
          width: 150,
          key: "type",
          sortable: "custom"
        },
        {
          title: videoStreamModel.main,
          width: 300,
          key: "main"
        },
        {
          title: videoStreamModel.sub,
          width: 300,
          key: "sub"
        },
        {
          title: videoStreamModel.position,
          width: 200,
          key: "position"
        },
        {
          title: videoStreamModel.status,
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
          title: videoStreamModel.weight,
          width: 100,
          key: "weight",
          sortable: "custom"
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
                      this.onDelete(row.id, `确定要删除码流【${row.name}】吗？`)
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
        unit: [{ required: true, message: "必选", trigger: "blur" }]
      },
      videoStreamModel,
      model: newVideoStream(),
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
            field: "video",
            args: [this.video]
          }
        ]
      },
      showMap: false,
      position: "",
      mapType: ""
    };
  },
  methods: {
    onAdd() {
      this.targetRoles = [];
      this.dialog = true;
      this.action = "add";
      this.$refs.form.resetFields();
      this.model = newVideoStream();
      this.model.video = this.video;
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
      videoStreamService.add(this.model).then(() => {
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
          videoStreamService
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
      videoStreamService
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
      videoStreamService.findAll(this.query).then(rep => {
        this.tableData = rep.data;
        this.loading = false;
      });

      this.loading = true;
    },

    onClose() {
      this.$emit("on-close", this.video);
    },
    onShowMap(position) {
      this.showMap = true;
      this.position = position;
    },
    onGetPosition({ lnglat }) {
      this.model.position = lnglat;
    }
  },
  mounted() {
    this.render();
  }
};
</script>
<style lang="less">
.page-video-stream {
  margin-top: 10px;
  &__header {
    margin-bottom: 10px;
    margin-top: 5px;
  }
}
</style>
