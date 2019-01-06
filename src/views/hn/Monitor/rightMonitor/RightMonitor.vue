<template>
    <div class="right-monitor f-right">
        <!--<div class="f-right__content">-->
            <!--<div  class="f-right__header">-->
                <!--<Icon type="md-analytics" />-->
                <!--{{data.name || '监控中心'}}-->
                <!--<span>Monitor</span>-->
                <!--<Icon type="md-close" class="f-right__close" @click="setRight('')" />-->
            <!--</div>-->
            <!--<div class="f-right__body">-->
                <!--<Spin v-show="loading&&monitorStation" fix></Spin>-->
                <!--<not-find v-if="!data.id">-->
                    <!--<div slot="button"></div>-->
                <!--</not-find>-->
                <!--<table class="station-table">-->
                    <!--<tr>-->
                        <!--<td class="t-name">上发时间</td>-->
                        <!--<td class="t-colon">:</td>-->
                        <!--<td class="t-value">{{data.time | up-time}}</td>-->
                    <!--</tr>-->
                    <!--<tr v-for="sensor in data.sensors" @click="onSelectSensor(sensor)" :key="sensor.id" :class="{selected: sensor.id == selectSensor.id}">-->
                        <!--<td class="t-name">{{sensor.name}}</td>-->
                        <!--<td class="t-colon">:</td>-->
                        <!--<td class="t-value">{{sensor.value | unit(sensor.unit)}}</td>-->
                    <!--</tr>-->
                <!--</table>-->

            <!--</div>-->
            <!--<div class="f-right__tab demo-tabs-style2">-->
                <!--<Tabs  type="card" value="chart" >-->
                    <!--<TabPane label="曲线" name="chart">-->
                        <!--<div ref="chart" style="height: 230px"></div>-->
                    <!--</TabPane>-->
                <!--</Tabs>-->
            <!--</div>-->
        <!--</div>-->
        <div class="f-right__menu">
            <ul>
                <li v-for="m in rightMenu" :class="{active: m.id == rightActive}" :key="m.id" @click="setRight(m.id)">
                    <a href="javascript:;" :style="{backgroundColor: m.color}">
                        <Icon :custom="m.icon" />
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "RightMonitor",
  computed: {
    ...mapState("monitor", [
      "rightActive",
      "rightMenu",
      "monitorStation",
      "right"
    ])
  },
  data() {
    return {
      data: {},
      selectSensor: {}
    };
  }
};
</script>

<style lang="less">
@import "~@/styles/theme.less";
.f-right {
  background-color: #fff;
  height: 100%;
  display: flex;
  position: absolute;
  width: 40px;
  right: 0;

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  &__header {
    background-color: #fff;
    line-height: 50px;
    height: 50px;
    border-bottom: 1px solid #ddd;
    padding: 0 10px;
    font-size: 16px;
    font-weight: bold;
    i {
      font-size: 22px;
      margin-top: -4px;
      margin-right: 10px;
    }

    span {
      font-weight: 200;
      font-size: 14px;
      margin-left: 10px;
      color: #999;
    }
  }

  &__close {
    float: right;
    cursor: pointer;
    margin-top: 12px !important;
  }

  &__menu {
    width: 40px;
    height: 100%;
    background-color: #f8fcff;
    box-shadow: -1px 0 1px #bbb;
    ul {
      display: flex;
      flex-direction: column;
      li {
        list-style: none;
        text-align: center;
        display: block;
        margin-top: 10px;
        &.active {
          a {
            background-color: @HeaderActiveBg;
          }
        }
        a {
          display: flex;
          width: 30px;
          height: 30px;
          justify-content: center;
          align-items: center;
          color: #fff;
          background-color: #485669;
          border-radius: 5px;
          margin: 0 auto;
          i {
            font-size: 16px;
          }
        }
      }
    }
  }

  &__body {
    padding: 0 15px 0 20px;
    position: relative;
    overflow-y: auto;
    flex: 1;
    .station-title {
      line-height: 40px;
      font-size: 16px;
      font-weight: bold;
      color: #2366ee;
      i {
        margin-top: -6px;
      }
    }

    .station-table {
      width: 100%;
      margin-top: 15px;
      background-color: #edfaff;
      border-collapse: collapse;
      tr {
        border: 1px solid #ddd;
        cursor: pointer;
        &.selected {
          background-color: #4d8dee !important;
          border: 1px solid #4d8dee;
          td {
            color: #fff;
          }
        }

        &:hover {
          background-color: #f2f2f2;
        }
      }
      td {
        line-height: 26px;
        font-size: 14px;
        &.t-name {
          padding-left: 20px;
          color: #555;
          width: 120px;
        }
        &.t-colon {
          font-weight: bold;
          width: 20px;
        }

        &.t-value {
          color: #0f2f6b;
          font-weight: bold;
        }
      }
    }
  }

  &__tab {
    height: 280px;
    padding: 0 15px 0 20px;
    .ivu-tabs-bar {
      margin-bottom: 0;
    }
    .ivu-tabs-content {
      border-left: 1px solid #dcdee2;
      border-bottom: 1px solid #dcdee2;
      border-right: 1px solid #dcdee2;
    }
  }
}
</style>
