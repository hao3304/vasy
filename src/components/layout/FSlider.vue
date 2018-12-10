<template>
    <div class="f-slider">
        <SideMenu :data="menus" :border="false" :collapsed="collapsed" ></SideMenu>
    </div>
</template>

<script>
export default {
  name: "FSlider",
  data() {
    return {
      collapsed: false,
      menus: [
        {
          text: "Forms",
          iconCls: "fa fa-wpforms",
          state: "open",
          children: [
            {
              text: "Form Element"
            },
            {
              text: "Wizard"
            },
            {
              text: "File Upload"
            }
          ]
        },
        {
          text: "Mail",
          iconCls: "fa fa-at",
          selected: true,
          children: [
            {
              text: "Inbox"
            },
            {
              text: "Sent"
            },
            {
              text: "Trash",
              children: [
                {
                  text: "Item1"
                },
                {
                  text: "Item2"
                }
              ]
            }
          ]
        },
        {
          text: "Layout",
          iconCls: "fa fa-table",
          children: [
            {
              text: "Panel"
            },
            {
              text: "Accordion"
            },
            {
              text: "Tabs"
            }
          ]
        }
      ]
    };
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

  @import "https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

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
