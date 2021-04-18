<template>
  <div class="validate-form-wrapper">
    <div class="form-name" v-if="formName">{{ formName }}</div>
    <form>
      <slot></slot>
    </form>
    <div
      class="btn"
      v-if="btnName"
      :style="{ width: btnWidth }"
      @click="submitForm"
      ref="submitRef"
    >
      {{ btnName }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import mitt from "mitt";

type ValidateFunc = () => boolean;

export const emitter = mitt();

export default defineComponent({
  name: "ValidateForm",
  emits: ["form-submit"],
  props: {
    formName: {
      type: String,
      required: false,
    },
    btnName: {
      type: String,
      required: false,
    },
    btnWidth: {
      type: String,
      required: false,
      default: "100%",
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

    const keyEnterSubmit = (event: KeyboardEvent) => {
      if (event.code === "Enter") {
        submitForm();
      }
    };

    onMounted(() => {
      document.addEventListener("keypress", keyEnterSubmit);
    });

    onUnmounted(() => {
      document.removeEventListener("keypress", keyEnterSubmit);
    })

    return { submitForm };
  },
});
</script>

<style lang="scss" scoped>
.validate-form-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  .form-name {
    font-size: 0.3rem;
    margin: 0 auto 0.5rem auto;
  }
  .btn {
    padding: 0.15rem 0;
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