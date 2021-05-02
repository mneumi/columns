<template>
  <div class="footer-wrapper">
    <div class="footer">
      <div class="copyright">
        &copy;
      </div>
      <div>
        mneumi (mneumi.cn) 版权所有 | 此仅为展示使用，不涉及商业用途 |
      </div>
      <span
        ><a href="https://beian.miit.gov.cn/#/Integrated/index"
          >粤ICP备20058567号-1</a
        ></span
      >
      <span
        ><a
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010602008696"
          >粤公网安备44010602008696号</a
        ></span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Footer",
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/mixins.scss";

.footer-wrapper {
  width: 100%;
  height: 0.7rem;
  background-color: $light-white-color;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  .footer {
    width: 12rem;
    height: 0.7rem;
    position: relative;
    @include center;
    a {
      font-size: 0.12rem;
      margin-left: 0.1rem;
    }
  }
}
</style>