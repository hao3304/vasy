<template>
    <div class="ticket-detail">
        <Card shadow>
            <div class="ticket-detail__top">
                <div class="top-left">
                        <span>
                            <i class="iconfont icon-huo"></i>
                        </span>
                    <div>点火</div>
                </div>
                <div class="top-center">
                    <h5>{{ticket.sn}}</h5>
                    <div>{{ticket.address}}</div>
                    <p>{{ticket.term}}</p>
                </div>
                <div class="top-right">

                    <slot name="button"></slot>
                </div>
            </div>
        </Card>
        <Card style="margin-top: 10px" class="ticket-detail__base" title="基本信息" shadow>
            <table>
                <tr>
                    <td>单号</td>
                    <td>{{ticket.sn}}</td>
                </tr>
                <tr>
                    <td>服务期限</td>
                    <td>{{new Date(ticket.term*1000).Format('yyyy-MM-dd hh:mm')}}</td>
                </tr>
                <tr>
                    <td>工单内容</td>
                    <td>{{ticket.desc}}</td>
                </tr>
                <tr>
                    <td>工单备注</td>
                    <td>{{ticket.remark}}</td>
                </tr>
            </table>
        </Card>
        <Card style="margin-top: 10px" title="处理记录"  shadow>
            <Spin fix v-show="loading"></Spin>
            <div style="text-align: center" v-if="tracks.length == 0">
                <img style="width: 100px" src="~@/assets/images/none.png" alt="">
                <p>暂无内容</p>
            </div>
            <Timeline>
                <TimelineItem v-for="t in tracks" :key="t.id">
                    {{new Date(t.created*1000).Format('yyyy-MM-dd HH:mm:ss')}}
                    <div>
                        <strong style="margin-right: 5px">{{t.operator?t.operator.name: ''}} </strong> <span v-show="t.ticket_action">进行了 “<span style="color: #006eff">{{t.ticket_action?t.ticket_action.name: ''}}</span>” 操作</span>
                    </div>
                    <div>
                        {{t.remark}}
                    </div>

                    <table class="ticket-table" v-show="t.track_fields.length > 0">
                        <tr v-for="field in t.track_fields" :key="field.id" v-if="field.track_field&&field.track_field.name">
                            <td class="name">
                                {{field.track_field?field.track_field.name:'-'}}
                            </td>
                            <td>
                                <template v-if="field.track_field.ftype == 'picture'">
                                    <a :href="getImage(val, 1000)" :data-lightbox="ticket.id" v-for="(val,index) in field.value.split(',')" v-if="val" :key="index" >
                                        <img class="ticket-table__img"  style="vertical-align: text-top;" :src="getImage(val, 200)" >
                                    </a>
                                </template>
                                <template v-if="field.track_field.ftype == 'now'">
                                    {{new Date(field.value*1000).Format('yyyy-MM-dd hh:mm')}}
                                </template>
                                <template v-if="field.track_field.ftype == 'cuid'">
                                    {{getUserName(field.value)}}
                                </template>
                                <template v-if="field.track_field.ftype == 'position'">
                                    <a @click="onShowPosition(field.value)" href="javascript:;">{{field.value}}</a>
                                </template>
                                <template v-if="['string', 'mobile'].indexOf(field.track_field.ftype)> -1">
                                    {{field.value||'-'}}
                                </template>
                            </td>
                        </tr>
                    </table>
                </TimelineItem>
            </Timeline>
        </Card>

        <map-position :show.sync="showMap" :position="position" type="simple"></map-position>
    </div>
</template>

<script>
import { GetTicket } from "@/graphqls/ticket.graphql";
import "lightbox2";
import "lightbox2/dist/css/lightbox.min.css";
import { baseURL } from "@/services/axios";
import { mapState } from "vuex";
export default {
  name: "ticketDetail",
  props: ["ticket"],
  computed: {
    ...mapState("common", ["users"])
  },
  data() {
    return {
      tracks: [],
      loading: false,
      position: "",
      showMap: false
    };
  },
  watch: {
    ticket() {
      if (this.ticket) {
        this.getDetail(this.ticket.id);
      }
    }
  },
  methods: {
    getDetail(id) {
      this.loading = true;
      this.$apollo
        .query({
          query: GetTicket,
          variables: {
            id: id
          }
        })
        .then(rep => {
          this.tracks = JSON.parse(
            JSON.stringify(rep.data.ticket.tracks)
          ).reverse();
          this.loading = false;
        });
    },
    getImage(id, size) {
      return baseURL + `/image/${id}/${size}/${size}`;
    },
    getUserName(id) {
      const user = this.users.find(u => u.id == id);
      return user ? user.name : "-";
    },
    onShowPosition(position) {
      this.position = position;
      this.showMap = true;
    }
  }
};
</script>

<style lang="less">
.ticket-detail {
  padding: 5px;
  overflow-y: auto;
  &__top {
    display: flex;
    .top-left {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      span {
        width: 40px;
        height: 40px;
        background-color: #f86c6b;
        display: flex;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        i {
          color: #fff;
          font-size: 24px;
        }
      }
    }

    .top-center {
      display: flex;
      flex: 1;
      padding: 0 10px;
      justify-content: center;
      flex-direction: column;
      div {
        color: #333;
      }
      p {
        color: #999;
        font-size: 12px;
      }
    }

    .top-right {
      width: 80px;
    }
  }

  &__base {
    table {
      td:first-child {
        text-align: right;
        padding: 0 5px;
        font-weight: bold;
      }
    }
  }

  .ticket-table {
    width: 100%;
    margin-top: 10px;
    border-collapse: collapse;
    td {
      border: 1px solid #ddd;
      padding: 2px 4px;
      color: #000;
      white-space: normal;
    }

    td.name {
      width: 100px;
      text-align: right;
      padding-right: 10px;
      background-color: #f1f1f1;
      color: #666;
    }

    &__img {
      width: 80px;
      height: 80px;
      margin-right: 5px;
    }
  }
}

.lightbox .lb-image {
  min-width: 220px;
  min-height: 220px;
}
</style>
