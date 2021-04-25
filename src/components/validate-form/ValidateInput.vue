<template>
  <div class="validate-input-wrapper">
    <div class="title" v-if="title">{{ title }}</div>
    <input
      autocomplete
      v-if="inputType === 'input'"
      v-bind="attrs"
      :value="inputReactive.val"
      @input="updateInput"
      @blur="validateInput"
    />
    <textarea
      autocomplete
      v-else-if="inputType === 'textarea'"
      v-bind="attrs"
      :value="inputReactive.val"
      @input="updateInput"
      @blur="validateInput"
    />
    <v-md-editor
      v-else-if="inputType === 'markdown'"
      v-model="inputReactive.val"
      @change="updateMarkdownInput"
      height="400px"
    ></v-md-editor>
    <div class="error-message">
      <span v-show="inputReactive.hasError">
        {{ inputReactive.errorMessage }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  SetupContext,
} from "vue";
import { emitter } from "./ValidateForm.vue";

interface RuleProp {
  type: "required" | "email" | "custom";
  message: string;
  validator?: () => boolean;
}
export type InputType = "input" | "textarea" | "markdown";
export type RulesProp = RuleProp[];

export default defineComponent({
  name: "ValidateInput",
  emits: ["update:modelValue"],
  props: {
    title: { type: String, required: false },
    modelValue: { type: String, required: true },
    rules: {
      type: Array as PropType<RulesProp>,
      required: true,
    },
    inputType: {
      type: String as PropType<InputType>,
      required: false,
      default: "input",
    },
  },
  setup(props, context) {
    const {
      inputReactive,
      updateInput,
      updateMarkdownInput,
    } = useInputReactive(props, context);
    const { validateInput } = useValidateInput(inputReactive, props.rules);
    const { attrs } = context;

    return {
      inputReactive,
      validateInput,
      updateInput,
      attrs,
      updateMarkdownInput,
    };
  },
});

const useInputReactive = (
  props: Readonly<
    {
      modelValue: string;
      rules: RulesProp;
      inputType: InputType;
    } & {
      title?: string | undefined;
    }
  >,
  context: SetupContext<"update:modelValue"[]>
) => {
  const inputReactive = reactive({
    val: computed({
      get: () => props.modelValue || "",
      set: (newValue) => newValue,
    }),
    hasError: true,
    errorMessage: "",
  });

  const updateInput = (e: KeyboardEvent) => {
    const newInputValue = (e.target as HTMLInputElement).value;
    inputReactive.val = newInputValue;
    context.emit("update:modelValue", newInputValue);
  };

  const updateMarkdownInput = (text: string) => {
    inputReactive.val = text;
    context.emit("update:modelValue", text);
  };

  return { inputReactive, updateInput, updateMarkdownInput };
};

const useValidateInput = (
  inputReactive: {
    val: string;
    hasError: boolean;
    errorMessage: string;
  },
  rules?: RulesProp
) => {
  const emailRegexp = /^([a-zA-Z]|[0-9])(\w|\\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/i;

  const validateInput = () => {
    if (rules) {
      const allPassed = rules.every((rule) => {
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

  emitter.emit("form-item-created", validateInput);

  return { validateInput };
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

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
    border: 0.01rem solid $dark-grey-color;
    font-size: 0.14rem;
  }
  .error-message {
    margin-top: 0.1rem;
    height: 0.2rem;
    color: $error-color;
  }
}
</style>