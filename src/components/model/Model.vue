<template>
  <div class="model-wrapper" v-if="showModel" @click.self="closeModel">
    <div class="container">
      <div class="title">{{ title }}</div>
      <div class="content">{{ content }}</div>
      <div class="controller">
        <div class="cancel btn" @click="closeModel">{{ cancelText }}</div>
        <div class="confirm btn">{{ confirmText }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Model",
  props: {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    confirmText: {
      type: String,
      required: false,
      default: "确认",
    },
    cancelText: {
      type: String,
      required: false,
      default: "取消",
    },
  },
  emits: ["confirm", "cancel"],
  setup(props, { emit }) {
    const showModel = ref<boolean>(true);

    const closeModel = () => {
      showModel.value = false;
      emit("cancel");
    };

    return {
      showModel,
      closeModel,
    };
  },
});
</script>

<style lang="scss" scoped>
.model-wrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  .container {
    width: 30%;
    height: 30%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    border-radius: 0.08rem;
    .title {
      flex: 2;
      border-bottom: 0.01rem solid rgba(0, 0, 0, 0.125);
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #0d6efd;
      color: #fff;
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
      // background-color: burlywood;
      .btn {
        margin: 0 0.1rem;
        background-color: red;
        padding: 0.05rem 0.1rem;
        border-radius: 0.04rem;
        color: #fff;
        &:hover {
          cursor: pointer;
        }
      }
      .confirm {
        background-color: seagreen;
      }
      .cancel {
        background-color: brown;
      }
    }
  }
}
</style>