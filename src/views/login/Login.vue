<template>
  <div class="login-wrapper">
    <div class="login">
      <ValidateForm
        formName="登录专栏"
        btnName="登录"
        @form-submit="formSubmit"
      >
        <ValidateInput
          title="邮箱"
          :rules="emailRules"
          v-model="emailVal"
          placeholder="请输入邮箱"
        />
        <ValidateInput
          type="password"
          title="密码"
          :rules="passwordRules"
          v-model="passwordVal"
          placeholder="请输入密码"
        />
        <router-link to="/register">
          <div class="link">还没有账号？立即注册!</div>
        </router-link>
      </ValidateForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { IStore } from "@/interface";
import { createMessage } from "@/components/message/Message.vue";
import ValidateInput, {
  RulesProp,
} from "../../components/validate-form/ValidateInput.vue";
import ValidateForm from "../../components/validate-form/ValidateForm.vue";

export default defineComponent({
  name: "Login",
  components: { ValidateInput, ValidateForm },
  setup() {
    const { emailVal, emailRules } = useEmailInput();
    const { passwordVal, passwordRules } = usePasswordInput();
    const { formSubmit } = useFormSubmit(emailVal, passwordVal);

    return {
      emailVal,
      emailRules,
      passwordVal,
      passwordRules,
      formSubmit,
    };
  },
});

const useEmailInput = () => {
  const emailVal = ref<string>("author03@outlook.com");
  const emailRules: RulesProp = [
    {
      type: "required",
      message: "邮箱不能为空",
    },
    {
      type: "email",
      message: "不满足邮箱格式",
    },
  ];

  return { emailVal, emailRules };
};

const usePasswordInput = () => {
  const passwordVal = ref<string>("ASDFGHJKL");
  const passwordRules: RulesProp = [
    {
      type: "required",
      message: "密码不能为空",
    },
  ];

  return { passwordVal, passwordRules };
};

const useFormSubmit = (emailVal: Ref<string>, passwordVal: Ref<string>) => {
  const router = useRouter();
  const store = useStore<IStore>();

  const formSubmit = (result: boolean) => {
    if (result) {
      store
        .dispatch("login", {
          email: emailVal.value,
          password: passwordVal.value,
        })
        .then(() => {
          createMessage("登录成功，2秒后跳转到主页", "success", () =>
            router.push("/")
          );
        })
        .catch((err) => {
          createMessage(err.data.message, "error");
        });
    }
  };

  return { formSubmit };
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.login-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 1rem;
  .login {
    width: 6rem;
    margin-top: 0.6rem;
    .link {
      color: $primary-color;
      margin: 0.2rem 0;
      &:hover {
        cursor: pointer;
      }
      text-align: center;
    }
  }
}
</style>