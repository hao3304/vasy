<template>
    <div class="map-position">
        <Modal @on-visible-change="onChange"
               :footer-hide="type == 'simple'"
               fullscreen
               v-model="dialog"
               :title="type == 'simple'?'位置信息':'请选择位置'">

            <div style="height: 100%">
                <div v-if="show" class="map-position__container">
                    <div class="map-position__map" ref="map">

                    </div>
                    <div class="map-position__info">

                        <div class="map-position__header">
                            当前位置信息
                        </div>
                        <h5>经纬度：</h5>
                        <p>
                            {{info.lnglat}}
                        </p>
                        <h5>地址：</h5>
                        <p>
                            {{info.address}}
                        </p>
                        <h5>最近的路口：</h5>
                        <p>
                            {{info.nearestJunction}}
                        </p>
                        <h5>最近的路：</h5>
                        <p>
                            {{info.nearestRoad}}
                        </p>
                        <h5>最近的标志：</h5>
                        <p>
                            {{info.nearestPOI}}
                        </p>
                    </div>
                </div>

                <div v-if="show" class="map-position__search" >
                    <input class="ivu-input" id="map_search" type="text"  placeholder="请输入关键字：（选定后搜索）">
                </div>
            </div>

            <div slot="footer">
                <Button @click="onCancel">取消</Button>
                <Button type="primary" @click="onClick">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
  name: "mapPosition",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    }
  },
  watch: {
    show() {
      this.dialog = this.show;
      if (this.dialog) {
        this.$nextTick(() => {
          this.render();
        });
      }
    }
  },
  data() {
    return {
      map: null,
      dialog: this.show,
      info: {
        lnglat: "",
        address: "",
        nearestJunction: "",
        nearestRoad: "",
        nearestPOI: ""
      }
    };
  },
  methods: {
    render() {
      const center = [120.76034545898439, 30.749507460819707];
      if (this.position) {
        const latlng = this.position.split(",");
        center[0] = parseFloat(latlng[0]);
        center[1] = parseFloat(latlng[1]);
      }

      const map = (this.map = new AMap.Map(this.$refs.map, {
        center: center,
        zoom: 14,
        resizeEnable: true,
        expandZoomRange: true,
        zooms: [3, 20]
      }));

      AMap.plugin(
        ["AMap.MapType", "AMap.Scale", "AMap.Autocomplete", "AMap.PlaceSearch"],
        function() {
          //异步加载插件
          map.addControl(new AMap.MapType());
          map.addControl(new AMap.Scale());
          const autoOptions = {
            city: "嘉兴",
            input: "map_search"
          };
          const autocomplete = new AMap.Autocomplete(autoOptions);
          const placeSearch = new AMap.PlaceSearch({
            city: "嘉兴",
            map: map
          });

          AMap.event.addListener(autocomplete, "select", function(e) {
            //TODO 针对选中的poi实现自己的功能
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);
          });
        }.bind(this)
      );

      AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
        const positionPicker = new PositionPicker({
          mode: "dragMap",
          map: map
        });
        positionPicker.on("success", result => {
          this.info.address = result.address;
          this.info.lnglat = `${result.position.lng},${result.position.lat}`;
          this.info.nearestJunction = result.nearestJunction;
          this.info.nearestPOI = result.nearestPOI;
          this.info.nearestRoad = result.nearestRoad;
        });
        positionPicker.start();
        map.panBy(0, 1);
      });
    },
    onClick() {
      this.$Modal.confirm({
        title: "结果确认",
        content: `
        <h5 style="color: #333;font-weight: bold">经纬度：</h5>
        <p>${this.info.lnglat}</p>
          <h5 style="color: #333;font-weight: bold">地址：</h5>
        <p>${this.info.address}</p>
          <h5 style="color: #333;font-weight: bold">最近的路口：</h5>
        <p>${this.info.nearestJunction}</p>
          <h5 style="color: #333;font-weight: bold">最近的路：</h5>
        <p>${this.info.nearestRoad}</p>
           <h5 style="color: #333;font-weight: bold">最近的标志：</h5>
        <p>${this.info.nearestPOI}</p>
        `,
        onOk: () => {
          this.$emit("on-select", this.info);
          this.$emit("update:show", false);
        }
      });
    },
    onCancel() {
      this.$emit("update:show", false);
    },
    onChange(v) {
      this.$emit("update:show", v);
    },
    setCenter(position) {
      const latlng = position.split(",");
      const center = new AMap.LngLat(
        parseFloat(latlng[0]),
        parseFloat(latlng[1])
      );
      this.map.setZoomAndCenter(16, center);
    }
  }
};
</script>

<style lang="less">
.map-position {
  &__container {
    height: 100%;
    margin: -16px;
    display: flex;
  }

  &__info {
    width: 220px;
    border-left: 1px solid #ddd;
    padding: 0 20px;

    h5 {
      color: #333;
      font-size: 12px;
      font-weight: bold;
      margin: 4px 0;
    }
  }

  &__map {
    flex: 1;
  }

  &__search {
    position: absolute;
    width: 300px;
    top: 20px;
    input {
      width: 100%;
    }
  }

  &__header {
    padding: 10px 0;
    font-size: 16px;
  }
}
</style>
