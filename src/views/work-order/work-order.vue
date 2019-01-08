<template>
    <div class="work-order">
        <div class="work-order__slider">
            <div class="work-order__menu">
                <ul>
                    <li :class="{active: active == m.id}" v-for="m in menus" :key="m.id">
                        <a href="javascript:;" @click="onSelect(m)">
                            <i :class="m.icon"></i>
                            <div>{{m.name}}</div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="work-order__content">
            <event v-if="active == 'Event'"></event>
            <ticket ref="ticket" v-if="active == 'Ticket'"></ticket>
        </div>
    </div>
</template>

<script>
import event from "./event";
import ticket from "./ticket";
export default {
  name: "work-order",
  components: {
    event,
    ticket
  },
  data() {
    return {
      menus: [
        {
          id: "Event",
          name: "事件",
          icon: "iconfont icon-yichangshijianliebiaocopy"
        },
        {
          id: "Ticket",
          name: "工单",
          icon: "iconfont icon-order"
        }
      ],
      active: "Event"
    };
  },

  methods: {
    onSelect(m) {
      this.active = m.id;
    }
  },
  mounted() {
    eventBus.$on("show-my-event", () => {
      this.active = "Ticket";
      this.$nextTick(() => {
        this.$refs.ticket.showOwn();
      });
    });
  }
};
</script>

<style lang="less">
.work-order {
  height: 100%;
  position: relative;
  padding-left: 60px;
  &__slider {
    position: absolute;
    left: 0;
    width: 60px;
    top: 0;
    background-color: #333;
    bottom: 0;
  }
  &__menu {
    width: 60px;
    border-top: 1px solid #22262f;
    ul {
      li {
        height: 60px;
        list-style: none;
        position: relative;
        &:after {
          position: absolute;
          left: 0;
          top: 0;
          content: " ";
          bottom: 0;
          border-right: 3px solid #00adb5;
          transform: scaleY(0.0001);
          opacity: 0;
          transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
            opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
            -webkit-transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        a {
          display: flex;
          height: 100%;
          flex-direction: column;
          align-items: center;
          color: #bbb;
          justify-content: center;
        }
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
          a {
            color: #5fbbff;
          }
        }

        &.active {
          background-color: #22262f;
          a {
            color: #5fbbff;
          }

          &:after {
            transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
              opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
              -webkit-transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
            opacity: 1;
            transform: scaleY(1);
          }
        }
      }
    }
  }
}
</style>
