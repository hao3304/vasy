import axios from "axios";
import Vue from "../main";
import Cookies from "js-cookie";
export const ROOT = process.env.VUE_APP_BOOT;
export const baseURL = ROOT + "/hsn";

const instance = axios.create({
  baseURL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    "X-AUTH-TOKEN": Cookies.get("token")
  }
});

instance.interceptors.response.use(
  res => {
    if (res.data.code === 0) {
      return res.data.response;
    } else if (res.data.code == 403) {
      Vue.$store.commit("logout");
      Vue.$router.push("/login");
      Vue.$Notice.error({
        title: "警告",
        desc: res.data.message,
        duration: 4
      });
      return Promise.reject();
    } else {
      Vue.$Notice.error({
        title: "警告",
        desc: res.data.message,
        duration: 4
      });
    }
  },
  error => {
    const { response } = error;
    if (!response) {
      Vue.$Notice.error({
        title: "警告",
        desc: error.message,
        duration: 4
      });

      return Promise.reject(error);
    }
    switch (response.status) {
      case 404:
        {
          Vue.$Notice.error({
            title: "警告",
            desc: "未找到服务！",
            duration: 4
          });
        }
        break;
      default:
        Vue.$Notice.error({
          title: "警告",
          desc: response.message,
          duration: 4
        });
    }

    return Promise.reject(error);
  }
);

export default instance;

export const RESTful = function(target) {
  return {
    findAll: params => instance.post(`/rest/${target}/query.json`, params),
    add: params => instance.post(`/rest/${target}`, params),
    remove: id => instance.delete(`/rest/${target}/${id}`),
    update: (id, params) => instance.put(`/rest/${target}/${id}`, params),
    findOne: id => instance.get(`/rest/${target}/${id}`),
    batchDelete: params =>
      instance.post(`/rest/${target}/batch-delete.json`, params),
    batchDeleteInsert: params =>
      instance.post(`/rest/${target}/batch-replace.json`, params)
  };
};
