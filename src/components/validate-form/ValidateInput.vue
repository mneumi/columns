<template>
  <div class="validate-input-wrapper">
    <div class="title">{{ title }}</div>
    <input
      v-bind="attrs"
      :value="inputReactive.val"
      @input="updateInput"
      @blur="validateInput"
      autocomplete
    />
    <div class="error-message" v-show="inputReactive.hasError">
      {{ inputReactive.errorMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive } from "vue";
import { emitter } from "./ValidateForm.vue";

interface RuleProp {
  type: "required" | "length>=6";
  message: string;
}

export type RulesProp = RuleProp[];

export default defineComponent({
  name: "ValidateInput",
  props: {
    rules: {
      type: Array as PropType<RulesProp>,
      required: true,
    },
    title: String,
    modelValue: String,
  },
  setup(props, { attrs, emit }) {
    const inputReactive = reactive({
      val: props.modelValue || "",
      hasError: false,
      errorMessage: "",
    });

    const updateInput = (e: KeyboardEvent) => {
      const newInputValue = (e.target as HTMLInputElement).value;
      inputReactive.val = newInputValue;
      emit("update:modelValue", newInputValue);
    };

    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every((rule) => {
          let passed = true;
          inputReactive.errorMessage = rule.message;

          switch (rule.type) {
            case "required":
              passed = inputReactive.val.trim() !== "";
              break;
            case "length>=6":
              passed = inputReactive.val.trim().length >= 6;
              break;
          }

          return passed;
        });

        inputReactive.hasError = !allPassed;

        return allPassed;
      }

      return true;
    };

    onMounted(() => {
      emitter.emit("form-item-created", validateInput);
    });

    return {
      inputReactive,
      validateInput,
      updateInput,
      attrs,
    };
  },
});
</script>

<style lang="scss" scoped>
.validate-input-wrapper {
  display: flex;
  flex-direction: column;
  width: 3.6rem;
  height: 1.1rem;
  box-sizing: border-box;
  padding: 0.15rem;
  .title {
    margin-bottom: 0.08rem;
  }
  input {
    margin-bottom: 0.08rem;
    outline: none;
    padding: 0.1rem;
    border-radius: 0.05rem;
    border: 0.01rem solid #666;
    font-size: 0.14rem;
  }
  .error-message {
    height: 0.2rem;
    color: red;
  }
}
</style>