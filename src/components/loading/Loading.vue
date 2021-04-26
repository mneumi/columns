<template>
  <teleport to="#loading">
    <div class="loading-wrapper" v-show="isLoading">
      <img src="https://columns-oss.oss-cn-shenzhen.aliyuncs.com/loading.gif" alt="网络加载中，请稍后...">
    </div>
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { IStore } from "@/interface";

export default defineComponent({
  name: "Loading",
  setup() {
    const { isLoading } = useIsLoading();

    return { isLoading };
  },
});

const useIsLoading = () => {
  const store = useStore<IStore>();

  const isLoading = computed(() => {
    return store.state.loading > 0;
  });

  return { isLoading };
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/mixins.scss";

.loading-wrapper {
  width: 100%;
  height: 100vh;
  background-color: $loading-background;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  @include center;
  font-size: 0.4rem;
  color: $black-color;
}
</style>