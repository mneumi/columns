<template>
  <div class="validate-form-wrapper">
    <div class="form-name">{{ formName }}</div>
    <form>
      <slot></slot>
    </form>
    <div class="btn" @click="submitForm">{{ btnName }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from "vue";
import mitt from "mitt";

type ValidateFunc = () => boolean;

export const emitter = mitt();

export default defineComponent({
  name: "ValidateForm",
  emits: ["form-submit"],
  props: {
    formName: {
      type: String,
      required: true,
    },
    btnName: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    let funcArray: ValidateFunc[] = [];

    const callback = (func: ValidateFunc | undefined) => {
      if (func) {
        funcArray.push(func);
      }
    };

    const submitForm = () => {
      const result = funcArray.map((func) => func()).every((result) => result);
      context.emit("form-submit", result);
    };

    emitter.on("form-item-created", callback);
    onUnmounted(() => {
      emitter.off("form-item-created", callback);
      funcArray = [];
    });

    return { submitForm };
  },
});
</script>

<style lang="scss" scoped>
.validate-form-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
  .form-name {
    font-size: 0.22rem;
    margin-bottom: 0.3rem;
  }
  .btn {
    width: 3.3rem;
    height: 0.38rem;
    background-color: #0d6efd;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 0.06rem;
    margin-top: 0.2rem;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>