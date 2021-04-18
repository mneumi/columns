<template>
  <Header />
  <router-view />
  <Footer />
  <Loading />
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue";
import { useStore } from "vuex";
import { IStore } from "./interface";
import { createMessage } from "./components/message/Message.vue";

import Header from "@/components/header/Header.vue";
import Footer from "@/components/footer/Footer.vue";
import Loading from "@/components/loading/Loading.vue";

export default defineComponent({
  name: "App",
  components: { Header, Footer, Loading },
  setup() {
    const store = useStore<IStore>();

    const message = computed(() => {
      return store.state.message.content;
    });

    store.dispatch("getUserInfo");

    watch(
      () => message.value,
      () => {
        const { content, type } = store.state.message;
        if (content !== "") {
          createMessage(content, type);
        }
      }
    );
  },
});
</script>

<style lang="scss" scoped>
</style>
