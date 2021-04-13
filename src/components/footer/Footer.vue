<template>
  <div class="footer-wrapper">
    <div class="footer">
      <span
        >&copy; mneumi (mneumi.cn) 版权所有 |
        此仅为展示使用，不涉及任何商业用途</span
      >
    </div>
  </div>
</template>

<script>
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
  }
}
</style>