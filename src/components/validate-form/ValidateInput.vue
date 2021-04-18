<template>
  <div class="validate-input-wrapper">
    <div class="title" v-if="title">{{ title }}</div>
    <input
      v-if="inputType === 'input'"
      v-bind="attrs"
      :value="inputReactive.val"
      @input="updateInput"
      @blur="validateInput"
      autocomplete
    />
    <textarea
      v-else
      v-bind="attrs"
      :value="inputReactive.val"
      @input="updateInput"
      @blur="validateInput"
      autocomplete
    />
    <div class="error-message">
      <span v-show="inputReactive.hasError">
        {{ inputReactive.errorMessage }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive } from "vue";
import { emitter } from "./ValidateForm.vue";

interface RuleProp {
  type: "required" | "email" | "custom";
  message: string;
  validator?: () => boolean;
}

export type InputType = "input" | "textarea";

export type RulesProp = RuleProp[];

export default defineComponent({
  name: "ValidateInput",
  props: {
    rules: {
      type: Array as PropType<RulesProp>,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    modelValue: {
      type: String,
      required: true,
    },
    inputType: {
      type: String as PropType<InputType>,
      required: false,
      default: "input",
    },
  },
  setup(props, { attrs, emit }) {
    const inputReactive = reactive({
      val: props.modelValue || "",
      hasError: true,
      errorMessage: "",
    });

    const updateInput = (e: KeyboardEvent) => {
      const newInputValue = (e.target as HTMLInputElement).value;
      inputReactive.val = newInputValue;
      emit("update:modelValue", newInputValue);
    };

    const emailRegexp = /^([a-zA-Z]|[0-9])(\w|\\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/i;

    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every((rule) => {
          let passed = true;
          inputReactive.errorMessage = rule.message;

          switch (rule.type) {
            case "required":
              passed = inputReactive.val.trim() !== "";
              break;
            case "email":
              passed = emailRegexp.test(inputReactive.val.trim());
              break;
            case "custom":
              if (rule.validator) {
                passed = rule.validator();
              } else {
                passed = false;
                inputReactive.errorMessage = "请输入自定义校验函数";
              }
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
  box-sizing: border-box;
  margin-bottom: 0.2rem;
  .title {
    margin-bottom: 0.12rem;
  }
  input,
  textarea {
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