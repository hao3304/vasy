<template>
    <div class="homepage-hero-module">
        <div class="video-container">
            <div :style="fixStyle" class="filter"></div>
            <video :style="fixStyle" autoplay loop class="fillWidth" muted poster="~@/assets/images/video_cover.jpeg" v-on:canplay="canplay">
                <source src="~@/assets/video/night.mp4" type="video/mp4"/>
                浏览器不支持 video 标签，建议升级浏览器。
            </video>
            <div class="poster hidden" v-if="!videoCanPlay">
                <img  :style="fixStyle" src="~@/assets/images/video_cover.jpeg" alt="">
            </div>
        </div>
        <div class="login-form">
            <div class="login-form__left">
                <div class="left-logo">
                    <img src="~@/assets/images/logo.png" alt="">
                </div>
                <div class="left-title">
                    <img src="~@/assets/images/sys.png" alt="">
                </div>
                <div class="left-desc">
                </div>
            </div>
            <div class="login-form__right">
                <h5>用户登陆</h5>
                <div>
                    <i-input v-model="form.account" size="large" placeholder="请输入用户名" >
                        <Icon type="md-contact" slot="prefix" />
                        <a @click="form.account = ''" v-show="form.account.length > 0" href="javascript:;" slot="suffix">
                            <Icon type="ios-close"  />
                        </a>
                    </i-input>
                </div>
                <div>
                    <i-input type="password" v-model="form.password" size="large" placeholder="请输入密码" >
                        <Icon type="md-key" slot="prefix" />
                        <a @click="form.password = ''" v-show="form.password.length > 0" href="javascript:;" slot="suffix">
                            <Icon type="ios-close"  />
                        </a>
                    </i-input>
                </div>
                <div>
                    <Button @click="onSubmit" :loading="loading" size="large" type="info" style="width: 100%">登 录</Button>
                </div>
                <p v-show="error" style="text-align: center;margin-top: 5px;color: #ed4014">{{error}}</p>
            </div>
        </div>

    </div>
</template>
<script>
import { mapMutations } from "vuex";
import loginService from "@/services/login";
import axios from "@/services/axios";
import Cookies from "js-cookie";
export default {
  name: "Login",
  data() {
    return {
      form: {
        account: "admin",
        password: "jxgsoft"
      },
      mode: "0",
      loading: false,
      videoCanPlay: false,
      fixStyle: "",
      error: ""
    };
  },
  methods: {
    ...mapMutations(["set_token"]),
    onSubmit() {
      this.loading = true;
      this.error = "";
      loginService
        .login(this.form)
        .then(rep => {
          if (rep) {
            this.set_token("token");
            axios.defaults.headers["X-AUTH-TOKEN"] = rep.token;
            Cookies.set("token", rep.token, { expires: 1 });
            this.$store.dispatch("common/init");
            this.$router.replace({ name: "hn-monitor" });
            this.$nextTick(() => {
              this.$store.commit("app/init", this.$route);
            });
          } else {
            this.error = "用户名或者密码错误";
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    canplay() {
      this.videoCanPlay = true;
    }
  },
  mounted() {
    window.onresize = () => {
      const windowWidth = document.body.clientWidth;
      const windowHeight = document.body.clientHeight;
      const windowAspectRatio = windowHeight / windowWidth;
      let videoWidth;
      let videoHeight;
      if (windowAspectRatio < 0.5625) {
        videoWidth = windowWidth;
        videoHeight = videoWidth * 0.5625;
        this.fixStyle = {
          height: windowWidth * 0.5625 + "px",
          width: windowWidth + "px",
          "margin-bottom": (windowHeight - videoHeight) / 2 + "px",
          "margin-left": "initial"
        };
      } else {
        videoHeight = windowHeight;
        videoWidth = videoHeight / 0.5625;
        this.fixStyle = {
          height: windowHeight + "px",
          width: windowHeight / 0.5625 + "px",
          "margin-left": (windowWidth - videoWidth) / 2 + "px",
          "margin-bottom": "initial"
        };
      }
    };
    window.onresize();
  }
};
</script>

<style lang="less">
.homepage-hero-module,
.video-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.video-container .poster img,
.video-container video {
  z-index: 0;
  position: absolute;
}

.video-container .filter {
  z-index: 1;
  position: absolute;
  background: rgba(0, 0, 0, 0.4);
}

.login-form {
  width: 580px;
  height: 320px;
  position: absolute;
  top: 50%;
  margin-top: -160px;
  left: 50%;
  margin-left: -290px;
  display: flex;
  z-index: 100;
  animation: fadeInDown;
  animation-duration: 1s;

  &__left {
    width: 290px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: slideRight 1s;
    background-color: rgba(255, 255, 255, 0.5);
    .left-logo {
      text-align: center;
      margin-bottom: 10px;
      position: relative;
      user-select: none;

      img {
        width: 116px;
        height: 30px;
      }
    }

    .left-title {
      text-align: center;
      margin-right: -30px;
      user-select: none;
      img {
        width: 320px;
      }
    }
  }

  &__right {
    width: 290px;
    background-color: #fff;
    padding: 40px 20px;
    h5 {
      text-align: center;
      font-size: 20px;
      font-weight: 200;
    }

    > div {
      margin-top: 25px;
    }
  }
}

@keyframes fadeInDown {
  0% {
    transform: translateY(-120px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideRight {
  0% {
    opacity: 0;
    transform: translateX(145px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
</style>
