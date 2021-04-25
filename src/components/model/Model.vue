<template>
  <div class="model-wrapper" v-if="showModel" @click.self="closeModel">
    <div class="container">
      <div class="title">{{ title }}</div>
      <div class="content">{{ content }}</div>
      <div class="controller">
        <div class="cancel btn" @click="closeModel">{{ cancelText }}</div>
        <div class="confirm btn" @click="confirmModel">{{ confirmText }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, createApp, PropType } from "vue";

type callbackType = () => void;

const Model = defineComponent({
  name: "Model",
  emits: ["confirm", "cancel"],
  props: {
    title: { type: String, required: true },
    content: { type: String, required: true },
    confirmText: { type: String, required: true },
    cancelText: { type: String, required: true },
    confirmCb: { type: Function as PropType<callbackType>, required: true },
    cancelCb: { type: Function as PropType<callbackType>, required: false },
  },
  setup(props) {
    const { showModel, closeModel, confirmModel } = useModel(
      props.confirmCb,
      props.cancelCb
    );

    return { showModel, closeModel, confirmModel };
  },
});

const useModel = (
  confirmCb: callbackType,
  cancelCb: callbackType | undefined
) => {
  const showModel = ref<boolean>(true);

  const closeModel = () => {
    showModel.value = false;
    if (cancelCb) {
      cancelCb();
    }
  };

  const confirmModel = () => {
    showModel.value = false;
    confirmCb();
  };

  return { showModel, closeModel, confirmModel };
};

export const createModel = (
  title: string,
  content: string,
  confirmText: string,
  cancelText: string,
  confirmCb: callbackType,
  cancelCb?: callbackType
): void => {
  const msgInstance = createApp(Model, {
    title,
    content,
    confirmText,
    cancelText,
    confirmCb,
    cancelCb,
  });

  const modelDOM = document.createElement("div");
  document.body.appendChild(modelDOM);
  msgInstance.mount(modelDOM);
};

export default Model;
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.model-wrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $light-black-color;
  .container {
    width: 30%;
    height: 30%;
    background-color: $white-color;
    display: flex;
    flex-direction: column;
    border-radius: 0.08rem;
    .title {
      flex: 2;
      border-bottom: 0.01rem solid $light-black-color;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $primary-color;
      color: $white-color;
      border-top-left-radius: 0.08rem;
      border-top-right-radius: 0.08rem;
    }
    .content {
      flex: 5;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .controller {
      flex: 3;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 0.2rem;
      .btn {
        margin: 0 0.1rem;
        background-color: $error-color;
        padding: 0.12rem 0.1rem;
        border-radius: 0.04rem;
        color: $white-color;
        &:hover {
          cursor: pointer;
        }
      }
      .confirm {
        background-color: $success-color;
      }
      .cancel {
        background-color: $error-color;
      }
    }
  }
}
</style>