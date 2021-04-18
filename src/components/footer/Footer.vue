<template>
  <div class="footer-wrapper">
    <div class="footer">
      <span
        >&copy; mneumi (mneumi.cn) 版权所有 |
        此仅为展示使用，不涉及任何商业用途 | </span
      >
      <span><a href="https://beian.miit.gov.cn/#/Integrated/index">粤ICP备20058567号-1</a></span>
      <span><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010602008696">粤公网安备44010602008696号</a></span>
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
.footer-wrapper {
  width: 100%;
  height: 0.7rem;
  background-color: #f8f9fa;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  .footer {
    width: 12rem;
    height: 0.7rem;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: .7rem;
    a {
      font-size: .12rem;
      margin-left: .1rem;
    }
  }
}
</style>