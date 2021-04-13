<template>
  <Header />
  <router-view />
  <Footer />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Header from "./components/header/Header.vue";
import Footer from "./components/footer/Footer.vue";

export default defineComponent({
  name: "App",
  components: { Header, Footer },
});
</script>

<style lang="scss" scoped>
</style>
