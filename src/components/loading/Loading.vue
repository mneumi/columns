<template>
  <teleport to="#loading">
    <div class="loading-wrapper" v-show="isLoading">
      网络请求中，请稍后 ...
    </div>
  </teleport>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineComponent } from "vue";
import { IStore } from "@/interface";

export default defineComponent({
  name: "Loading",
  setup() {
    const store = useStore<IStore>();

    const isLoading = computed(() => {
      return store.state.loading > 0;
    });

    return {
      isLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.loading-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.95);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: .4rem;
  color: black;
}
</style>