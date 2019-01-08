<template>
    <div class="tree-select" v-click-outside="onClickOutside">
        <Input :placeholder="placeholder" v-model="str"  @on-focus="onFocus"  />
        <div class="tree-select__block" :class="{expand: expand}">
            <div ref="tree" class="ztree"></div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      default: "请选择",
      type: String
    },
    treeData: {
      default: () => [],
      type: Array
    },
    value: {
      default: "",
      type: String
    }
  },
  data() {
    return {
      expand: false,
      str: ""
    };
  },
  name: "treeSelect",
  watch: {
    treeData() {
      if (this.treeData.length > 0) {
        this.renderTree();
      }
    },
    value() {
      if (this.value == "" || this.value == null) {
        this.str = "";
      } else {
        const target = this.treeData.find(d => d.id == this.value);
        if (target) {
          this.str = target.name;
          const node = this.zTree.getNodeByParam("id", target.id, null);
          this.zTree.selectNode(node);
        }
      }
    }
  },
  methods: {
    onFocus() {
      this.expand = true;
    },
    onClickOutside() {
      this.expand = false;
    },
    renderTree() {
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
          onClick: (event, treeId, treeNode) => {
            this.expand = false;
            this.$emit("input", treeNode.id);
            this.str = treeNode.name;
          }
        }
      };

      this.zTree = $.fn.zTree.init($(this.$refs.tree), setting, this.treeData);
    }
  },
  mounted() {}
};
</script>

<style lang="less">
.tree-select {
  position: relative;
  &__block {
    position: absolute;
    height: 0;
    border: 1px solid #ccc;
    width: 100%;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    overflow: auto;
    background-color: #fff;
    transition: height 0.25s ease;
    opacity: 0;
    z-index: 1000;
    &.expand {
      height: 220px;
      opacity: 1;
    }
  }
}
</style>
