<template>
  <div v-if="showMessage" class="message-wrapper">
    <div class="container">
      <div class="content" v-html="msg"></div>
      <div class="close">
        <div class="iconfont btn" @click="closeMessage">&#xe605;</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, createApp } from "vue";

const Message = defineComponent({
  name: "CenterMessage",
  props: {
    msg: { type: String, required: true },
    cb: { type: Function, required: true },
  },
  setup(props) {
    const showMessage = ref<boolean>(true);
    const closeMessage = () => {
      showMessage.value = false;
      props.cb();
    };

    return { showMessage, closeMessage };
  },
});

export const createCenterMessage = (msg: string): void => {
  const msgDOM = document.createElement("div");
  document.body.appendChild(msgDOM);

  const msgInstance = createApp(Message, {
    msg,
    cb: () => {
      msgInstance.unmount();
      document.body.removeChild(msgDOM);
    },
  });

  msgInstance.mount(msgDOM);
};

export default Message;
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/mixins.scss";

.message-wrapper {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  background-color: $dark-black-color;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  .container {
    width: 8rem;
    height: 3rem;
    background-color: $primary-color;
    display: flex;
    flex-direction: column;
    border-radius: 0.2rem;
    .content {
      flex: 1;
      color: $white-color;
      font-size: 0.22rem;
      line-height: 0.4rem;
      box-sizing: border-box;
      padding: 0 0.6rem;
      @include center;
    }
    .close {
      width: 100%;
      height: 0.6rem;
      background-color: $dark-primary-color;
      border-bottom-left-radius: 0.2rem;
      border-bottom-right-radius: 0.2rem;
      color: $white-color;
      @include center;
      .btn {
        font-size: 0.28rem;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>