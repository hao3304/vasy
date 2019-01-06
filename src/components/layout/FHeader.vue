<template>
    <div class="f-header">
        <div class="f-header__title">
            <img src="~@/assets/images/ff.png" style="width: 40px;margin-left: 20px;margin-right: -20px;" alt=""> <img src="~@/assets/images/sys.png" style="width: 320px;" alt="">
        </div>

        <div class="f-header__module">
            <ul>
                <li v-for="m in module" :class="{active: m.id == selectModule}" @click="set_module(m.id)" :key="m.id">
                    <a href="javascript:;">
                        <iconfont :icon="m.iconCls"></iconfont>
                        <span>{{m.text}}</span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="f-header__toolbar">
            <span style="display: inline-block;height: 28px;width: 1px;background-color: #1534ca;margin-right: 20px"></span>
            <Badge style="margin-right: 20px;" dot>
                <Icon type="md-notifications-outline" class="f-header__icon" size="22" ></Icon>
            </Badge>
            <Icon style="margin-right: 20px;" type="md-refresh" class="f-header__icon" @click="onRefresh"  size="22" />
            <Icon style="margin-right: 20px;" class="f-header__icon" custom="iconfont icon-quanping" v-if="!fullScreen" size="22" @click="onFullScreen" ></Icon>
            <Icon style="margin-right: 20px;" class="f-header__icon" custom="iconfont icon-009pingmusuoxiao" v-if="fullScreen"  size="22" @click="onExitFullScreen" ></Icon>
            <Icon style="margin-right: 10px;" class="f-header__icon" custom="iconfont icon-tuichu" size="22" @click="onLogout" ></Icon>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Cookies from "js-cookie";
export default {
  name: "FHeader",
  computed: {
    ...mapState("app", ["module", "selectModule"])
  },
  data() {
    return {
      fullScreen: false
    };
  },
  methods: {
    ...mapMutations("app", ["set_module"]),
    ...mapMutations(["logout"]),
    onLogout() {
      this.$Modal.confirm({
        title: "提示",
        content: "确定要退出当前用户？",
        onOk: () => {
          this.logout();
          Cookies.remove("token");
          this.$router.replace({ name: "login" });
        },
        onCancel: () => {}
      });
    },
    onFullScreen() {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      this.fullScreen = true;
    },
    onExitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      this.fullScreen = false;
    },
    onRefresh() {
      eventBus.$emit("refresh");
    }
  }
};
</script>

<style lang="less">
@import "~@/styles/theme.less";

.f-header {
  height: @HeaderHeight;
  background-color: @HeaderBg;
  background-image: linear-gradient(143deg, #2945cb 20%, #0072ca 81%, #3a9dff);
  display: flex;

  &__title {
    display: flex;
    align-items: center;
  }

  &__module {
    flex: 1;
    ul {
      padding: 0;
      margin: 0;
      height: 100%;
      li {
        list-style: none;
        width: 90px;
        height: 100%;
        display: inline-block;
        transition: all 0.2s;
        &.active {
          background-color: @HeaderActiveBg;
          a {
            color: #fff;
          }
        }

        &:hover {
          a {
            color: #fff;
          }
        }
        a {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          i {
            font-size: 22px;
            height: 30px;
          }
          span {
            font-size: 12px;
          }
        }
      }
    }
  }
  &__toolbar {
    display: flex;
    align-items: center;
    .ivu-icon {
      color: #efefef;
      cursor: pointer;
      &:hover {
        color: #fff;
      }
    }
  }
}
</style>
