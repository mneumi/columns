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
    <div class="close" @click="showMessage = false">X</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, createApp } from "vue";
import { MessageType } from "@/interface";

export const createMessage = (
  msg: string,
  msgType: MessageType,
  callback?: () => void,
  timeout?: number
): void => {
  const msgInstance = createApp(Message, {
    msg,
    msgType,
  });

  if (!timeout) {
    timeout = 2000;
  }

  const msgDOM = document.createElement("div");
  document.body.appendChild(msgDOM);
  msgInstance.mount(msgDOM);

  setTimeout(() => {
    msgInstance.unmount();
    document.body.removeChild(msgDOM);
    if (callback) {
      callback();
    }
  }, timeout);
};

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
  },
  setup() {
    const showMessage = ref<boolean>(true);

    return { showMessage };
  },
});

export default Message;
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.message-wrapper {
  position: fixed;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: $grey-color;
  color: $white-color;
  display: flex;
  border-radius: 0.05rem;
  padding: 0.15rem;
  .content {
    flex: 1;
    margin-right: 0.5rem;
  }
  .close {
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      cursor: pointer;
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