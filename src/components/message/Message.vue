<template>
  <div
    v-if="showMessage"
    :class="{
      'message-wrapper': true,
      error: msgType === 'error',
      success: msgType === 'success',
    }"
  >
    <div class="content">{{ msg }}</div>
    <div class="close" @click="closeMessage">
      <div class="iconfont">&#xe605;</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, createApp } from "vue";

type MessageType = "success" | "error" | "default";

const Message = defineComponent({
  name: "Message",
  props: {
    msg: {
      type: String,
      required: true,
    },
    msgType: {
      type: String as PropType<MessageType>,
      required: true,
    },
    cb: {
      type: Function,
      required: true,
    },
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

export const createMessage = (
  msg: string | undefined,
  msgType: MessageType,
  callback?: () => void,
  timeout?: number
): void => {
  if (!msg) {
    msg = "网络请求发生错误";
  }

  let hasClose = false;

  const msgInstance = createApp(Message, {
    msg,
    msgType,
    cb: () => {
      if (!hasClose) {
        msgInstance.unmount();
        document.body.removeChild(msgDOM);
        hasClose = true;
      }
    },
  });

  if (!timeout) {
    timeout = 2000;
  }

  const msgDOM = document.createElement("div");
  document.body.appendChild(msgDOM);
  msgInstance.mount(msgDOM);

  setTimeout(() => {
    if (!hasClose) {
      msgInstance.unmount();
      document.body.removeChild(msgDOM);
      hasClose = true;
    }
    if (callback) {
      callback();
    }
  }, timeout);
};

export default Message;
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/mixins.scss";

.message-wrapper {
  position: fixed;
  z-index: 999;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: $grey-color;
  color: $white-color;
  display: flex;
  align-items: center;
  border-radius: 0.05rem;
  padding: 0.15rem;
  .content {
    flex: 1;
    margin-right: 0.5rem;
  }
  .close {
    @include center;
    &:hover {
      cursor: pointer;
    }
    .iconfont {
      font-size: 0.24rem;
    }
  }
}
.error {
  background-color: $error-color !important;
}
.success {
  background-color: $success-color !important;
}
</style>