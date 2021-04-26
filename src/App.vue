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
    createCenterMessage(
      "温馨提示：本项目仅用于展示使用，并不提供实际的服务<br />（由于服务器带宽小，请求可能挺慢，请耐心等候 ...）"
    );
  },
});
</script>

<style lang="scss" scoped>
</style>
