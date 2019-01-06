<template>
    <div class="f-slider">
        <div class="f-slider__collapse">
            <i class="iconfont icon-menu"></i>
        </div>
        <SideMenu @itemClick="onSelect" :data="sliderMenu" :border="false" :collapsed="collapsed" ></SideMenu>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "FSlider",
  data() {
    return {
      collapsed: false,
      menus: []
    };
  },
  computed: {
    ...mapState("app", ["sliderMenu"])
  },
  methods: {
    ...mapMutations("app", ["add_tab"]),
    onSelect(menu) {
      this.add_tab(menu);
    }
  }
};
</script>

<style lang="less">
@import "~@/styles/theme";
.f-slider {
  width: @SliderWidth;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: #222d32;

  &__collapse {
    height: 33px;
    line-height: 33px;
    display: none;
    text-align: center;
    background-color: #333;
    cursor: pointer;
    i {
      color: #bbb;
    }
    &:hover {
      i {
        color: #fff;
      }
    }
  }

  @import "https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

  .sidemenu {
    .panel-with-icon {
      padding-left: 20px;
    }

    .accordion-header-selected .panel-title,
    .accordion-header-selected .panel-icon {
      color: #fff !important;
    }
  }

  .sidemenu li {
    cursor: pointer;
    .tree-icon {
      display: none;
    }
  }
  .sidemenu .panel-icon {
    margin-top: -12px;
    height: 20px;
  }

  .sidemenu .accordion .panel-title {
    color: #b8c7ce;
  }
  .sidemenu .accordion .accordion-header {
    background: #222d32;
    color: #b8c7ce;
  }
  .sidemenu .accordion .accordion-body {
    background: #2c3b41;
    color: #8aa4af;
  }
  .sidemenu .accordion .accordion-header-selected {
    background: #1e282c;
  }
  .sidemenu .tree-node-hover {
    background: #2c3b41;
    color: #fff;
  }
  .sidemenu .tree-node-selected {
    background: #2c3b41;
    color: #fff;
  }
  .sidemenu .accordion-header .panel-tool {
    display: none;
  }
  .sidemenu .accordion-header::after,
  .sidemenu .tree-node-nonleaf::after {
    display: inline-block;
    vertical-align: top;
    border-style: solid;
    transform: rotate(45deg);
    width: 4px;
    height: 4px;
    content: "";
    position: absolute;
    right: 10px;
    top: 50%;
    margin-top: -3px;
    border-width: 0 1px 1px 0;
  }
  .sidemenu .accordion-header-selected::after {
    transform: rotate(-135deg);
  }
  .sidemenu .tree-node-nonleaf::after {
    transform: rotate(-135deg);
  }
  .sidemenu .tree-node-nonleaf-collapsed::after {
    transform: rotate(45deg);
  }
  .sidemenu-collapsed .accordion-header::after {
    display: none;
  }
  .sidemenu-tooltip .accordion {
    border-color: #1e282c;
  }
}
</style>
