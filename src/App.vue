<template>
  <Header />
  <router-view />
  <Footer />
  <Loading />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/header/Header.vue";
import Footer from "@/components/footer/Footer.vue";
import Loading from "@/components/loading/Loading.vue";
import { createCenterMessage } from "./components/message/CenterMessage.vue";

export default defineComponent({
  name: "App",
  components: {
    Header,
    Footer,
    Loading,
  },
  setup() {
    if (document.documentElement.clientWidth < 1200) {
      alert(
        "温馨提示：本项目仅支持大屏幕使用，并未适配移动端，请放大浏览器窗口或者更换设备获得更好的体验！"
      );
    }
    createCenterMessage(
      "温馨提示：本项目仅用于展示使用，并不用于提供任何商业用途和实际服务（由于服务器带宽小，请求可能挺慢，请耐心等候 ...）"
    );
  },
});
</script>

<style lang="scss" scoped>
</style>
