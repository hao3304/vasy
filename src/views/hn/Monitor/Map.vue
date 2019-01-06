<template>
    <div class="monitor-map">
        <div class="monitor-map__left">
            <Table size="small" :data="tableData" @on-row-click="onRowClick" :height="height" :columns="columns"></Table>
        </div>
        <div class="monitor-map__right" id="map"></div>
    </div>
</template>

<script>
import { mapState } from "vuex";
const gsyIcon = require("@/assets/images/map/gsy.png");
const areaIcon = require("@/assets/images/icon/area.png");
import Vue from "vue";
export default {
  name: "Map",
  props: ["height"],
  data() {
    return {
      map: null,
      query: {
        limit: 20,
        page: 1
      },
      columns: [
        {
          title: "#",
          type: "index",
          width: 60
        },
        {
          title: "站点名称",
          key: "name",
          render(h, { row }) {
            return row.position
              ? h("div", {}, [
                  h("img", {
                    attrs: {
                      src: areaIcon
                    },
                    style: {
                      marginBottom: "-3px"
                    }
                  }),
                  h("span", {}, row.name)
                ])
              : h("div", {}, row.name);
          }
        }
      ]
    };
  },
  computed: {
    ...mapState(["windowHeight"]),
    ...mapState("monitor", ["stations"]),
    tableData() {
      return this.stations;
    }
  },
  watch: {
    stations() {
      if (this.stations.length > 0) {
        this.renderStation();
      }
    }
  },
  methods: {
    renderMap() {
      const map = (this.map = new AMap.Map("map", {
        center: [120.76034545898439, 30.749507460819707],
        zoom: 14,
        pitch: 45,
        resizeEnable: true,
        expandZoomRange: true,
        zooms: [3, 20],
        viewMode: "3D"
      }));

      this.infoWindow = new AMap.InfoWindow({
        isCustom: true,
        content: "",
        offset: new AMap.Pixel(16, -45)
      });

      // this.stationLayer = new AMap.OverlayGroup();
      this.cluster = new AMap.MarkerClusterer(map, [], { gridSize: 80 });

      AMap.plugin(
        ["AMap.ToolBar", "AMap.MapType", "AMap.Scale", "AMap.ControlBar"],
        function() {
          //异步加载插件
          map.addControl(new AMap.ToolBar());
          map.addControl(new AMap.MapType());
          map.addControl(new AMap.Scale());
          map.addControl(
            new AMap.ControlBar({
              position: {
                right: "10px",
                bottom: "-50px"
              },
              showZoomBar: false
            })
          );
        }
      );
    },
    renderStation() {
      this.cluster.clearMarkers();
      const data = this.stations;
      const markers = [];
      data.forEach(d => {
        if (d.position) {
          const latlng = d.position.split(",");
          const marker = new AMap.Marker({
            label: {
              content: null,
              offset: new AMap.Pixel(12, 20)
            },
            position: new AMap.LngLat(
              parseFloat(latlng[0]),
              parseFloat(latlng[1])
            ),
            icon: new AMap.Icon({
              image: gsyIcon,
              size: new AMap.Size(24, 24),
              imageSize: new AMap.Size(24, 24)
            }),
            extData: d
          });
          marker.on("click", e => {
            const data = e.target.getExtData();
            this.infoWindow.setContent(this.getInfoContent(data));
            this.infoWindow.open(this.map, e.target.getPosition());
          });
          marker.setLabel({
            content: d.name
          });
          // this.stationLayer.addOverlay(marker);
          markers.push(marker);
          // this.setLabel(marker, d.name, "Devices");
        }
      });
      if (markers.length > 0) {
        this.cluster.addMarkers(markers);
      }
    },
    getInfoContent(data) {
      return (
        `
        <div class="custom-info input-card content-window-card">
            <div class="info-top"><div>${
              data.name
            }</div><img onclick="closeInfoWindow()" src="https://webapi.amap.com/images/close2.gif"></div>
            <div class="info-middle" style="background-color: white;"><table>
            <tr><td class="name">上传时间</td><td colspan="2" style="color: #2d8cf0">${Vue.filter(
              "up-time"
            )(data.time)}</td></tr>
            ` +
        data.sensors
          .map(sensor => {
            const value = Vue.filter("unit")(sensor.value, sensor.unit);
            const ll = value.split(" ");
            return `
                <tr>
                <td class="name">${sensor.name}</td>
                <td class="value">${ll[0]}</td>
                <td>${ll[1] || ""}</td>
                </tr>
            `;
          })
          .join("") +
        `
</table></div>
            <div class="info-bottom" style="position: relative; top: 0px; margin: 0px auto;"><img src="https://webapi.amap.com/images/sharp.png"></div>
            </div>
        </div>
      `
      );
    },
    onPage(page) {
      this.query.page = page;
    },
    onRowClick(data) {
      if (data.position) {
        this.infoWindow.setContent(this.getInfoContent(data));
        const latlng = data.position.split(",");
        this.map.setZoomAndCenter(18, [
          parseFloat(latlng[0]),
          parseFloat(latlng[1])
        ]);
        this.infoWindow.open(this.map, [
          parseFloat(latlng[0]),
          parseFloat(latlng[1])
        ]);
      }
    }
  },
  mounted() {
    this.renderMap();
    if (this.stations.length > 0) {
      this.renderStation();
    }
    window.closeInfoWindow = () => {
      this.map.clearInfoWindow();
    };
  }
};
</script>

<style lang="less">
.monitor-map {
  display: flex;
  background-color: #fff;
  height: 100%;
  &__left {
    width: 250px;
    border-right: 1px solid #ddd;
    z-index: 8;
    .ivu-tabs-bar {
      margin-bottom: 0;
    }
    .ivu-tabs-nav {
      width: 100%;
      .ivu-tabs-tab {
        width: 116px;
        text-align: center;
      }
    }
  }

  &__right {
    flex: 1;
  }

  &__station {
    table {
      width: 100%;
      border-collapse: collapse;
      tr {
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        cursor: pointer;
        &:hover {
          background-color: #f1f1f1;
        }
      }
      td {
        line-height: 36px;
        text-align: center;
        &:last-child {
          color: #2366ee;
        }

        &:first-child {
          width: 40px;
        }
      }
    }
  }
}

.amap-logo,
.amap-copyright {
  display: none !important;
}

.content-window-card {
  position: relative;
  box-shadow: none;
  bottom: 0;
  left: 0;
  width: auto;
  padding: 0;
}

.content-window-card p {
  height: 2rem;
}

.custom-info {
  border: solid 1px silver;
}

div.info-top {
  position: relative;
  background: none repeat scroll 0 0 #f9f9f9;
  border-bottom: 1px solid #ccc;
  border-radius: 5px 5px 0 0;
}

div.info-top div {
  display: inline-block;
  color: #333333;
  font-size: 14px;
  font-weight: bold;
  line-height: 31px;
  padding: 0 40px 0 10px;
}

div.info-top img {
  position: absolute;
  top: 10px;
  right: 10px;
  transition-duration: 0.25s;
}

div.info-top img:hover {
  box-shadow: 0px 0px 5px #000;
}

div.info-middle {
  font-size: 12px;
  padding: 10px 6px;
  line-height: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
    tr td.name {
      width: 90px;
      text-align: right;
      padding-right: 15px;
      background-color: #f1f1f1;
      color: #666;
    }

    td.device {
      text-align: center;
      width: 30px;
    }

    td.value {
      min-width: 80px;
    }

    td {
      border: 1px solid #ddd;
      padding: 2px 4px;
      color: #000;
    }
  }
}

div.info-bottom {
  height: 0;
  width: 100%;
  clear: both;
  text-align: center;
}

div.info-bottom img {
  position: relative;
  z-index: 104;
}

.info-middle img {
  float: left;
  margin-right: 6px;
}
</style>
