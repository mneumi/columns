<template>
  <div class="slogn-wrapper">
    <img src="http://zhihu.vikingship.xyz/img/callout.5b86dfc8.svg" />
    <div class="slogn">随心写作，快乐表达</div>
    <div class="btn" @click="handleClick">开始写文章</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useRouter } from "vue-router";

export default defineComponent({
  name: "Slogn",
  setup() {
    const router = useRouter();

    const handleClick = () => {
      router.push("/write");
    };

    return { handleClick };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.slogn-wrapper {
  width: 100%;
  padding-top: 0.7rem;
  height: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.3rem;
  img {
    width: 3.08rem;
  }
  .slogn {
    font-size: 0.4rem;
  }
  .btn {
    width: 1.2rem;
    height: 0.5rem;
    background-color: $primary-color;
    line-height: 0.5rem;
    text-align: center;
    border-radius: 0.04rem;
    color: $white-color;
    margin-top: 0.4rem;
    &:hover {
      background-color: darken($primary-color, 10%);
      cursor: pointer;
    }
  }
}
</style>