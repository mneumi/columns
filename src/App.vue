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

export default defineComponent({
  name: "App",
  components: {
    Header,
    Footer,
    Loading,
  },
});
</script>

<style lang="scss" scoped>
</style>
