<template>
    <div>
        <Form ref="form" v-if="fields.length > 0" :label-width="75" :rules="rules" :model="map" >
            <FormItem  v-for="field in fields" :key="field.id" :label="field.name"  :prop="field.id">
                <user-select :roles="roles" v-model="map[field.id]" v-if="field.ftype == 'uid'" :placeholder="field.desc"></user-select>
                <DatePicker readonly @on-change="(v, date)=>onDateChange(field.id,v, date)" :value="map[field.id]" type="datetime" v-if="field.ftype == 'now'" :format="field.format?field.format:'yyyy-MM-dd HH:mm'" style="width: 100%" :placeholder="field.desc" ></DatePicker>
                <Input v-if="field.ftype =='cuid'" readonly v-model="me.name" />

                <i-input  v-if="field.ftype == 'position'" v-model="map[field.id]" readonly :placeholder="field.desc"  >
                            <span slot="append">
                                <Button @click="onShowMap(field.id)">选取</Button>
                            </span>
                </i-input>
            </FormItem>

            <map-position @on-select="onSelectPosition" :show.sync="showMap"></map-position>
        </Form>
    </div>
</template>

<script>
import userSelect from "@/components/userSelect";
import { mapState } from "vuex";
import mapPosition from "@/components/mapPosition";
export default {
  props: {
    fields: {
      default: () => {
        return [];
      },
      type: Array
    },
    roles: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      map: {},
      rules: {
        cuid: [{ required: true, message: "必填", trigger: "change" }]
      },
      showMap: false,
      positionField: ""
    };
  },
  watch: {
    fields() {
      if (this.fields.length > 0) {
        this.initMap();
      }
    }
  },
  components: {
    userSelect,
    mapPosition
  },
  name: "action-form",
  computed: {
    ...mapState("common", ["me"])
  },
  methods: {
    initMap() {
      this.map = {};
      this.fields.forEach(field => {
        this.$set(this.map, field.id, "");
        if (field.ftype == "now") {
          this.map[field.id] = new Date().Format(
            field.format ? field.format : "yyyy-MM-dd HH:mm"
          );
        }
        if (field.ftype == "cuid") {
          this.map[field.id] = this.me.id;
        }
      });
    },
    onDateChange(field, v) {
      this.map[field] = v;
    },
    getFields() {
      const fields = [];
      this.fields.forEach(field => {
        let val = this.map[field.id];
        if (["now", "date"].indexOf(field.ftype) > -1) {
          val = Date.parse(new Date(val)) / 1000 + "";
        }
        fields.push({ field: field.id, value: val });
      });
      return fields;
    },
    valid(callback) {
      if (this.$refs.form) {
        this.$refs.form.validate(valid => {
          if (valid) {
            callback(valid, this.getFields());
          } else {
            callback(valid);
          }
        });
      } else {
        callback(true);
      }
    },
    onShowMap(field) {
      this.positionField = field;
      this.showMap = true;
    },
    onSelectPosition({ lnglat }) {
      this.map[this.positionField] = lnglat;
    }
  }
};
</script>

<style scoped>
</style>
