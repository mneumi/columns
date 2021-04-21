<template>
  <Header />
  <router-view />
  <Footer />
  <Loading />
</template>

<script lang="ts">
import { defineComponent, watch, computed } from "vue";
import { useStore } from "vuex";
import Header from "@/components/header/Header.vue";
import Footer from "@/components/footer/Footer.vue";
import Loading from "@/components/loading/Loading.vue";
import { IStore } from "./interface";
import { createMessage } from "./components/message/Message.vue";

const useListenGlobalError = () => {
  const store = useStore<IStore>();

  const message = computed(() => {
    return store.state.message.content;
  });

  watch(
    () => message.value,
    () => {
      const { content, type } = store.state.message;
      if (content !== "") {
        createMessage(content, type);
      }
    }
  );
};

export default defineComponent({
  name: "App",
  components: {
    Header,
    Footer,
    Loading,
  },
  setup() {
    useListenGlobalError();
  },
});
</script>

<style lang="scss" scoped>
</style>
