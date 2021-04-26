<template>
  <div class="register-wrapper">
    <div class="register">
      <ValidateForm
        formName="注册新账号"
        btnName="注册"
        @form-submit="formSubmit"
      >
        <ValidateInput
          title="邮箱（可用假邮箱测试，满足邮箱格式即可）"
          :rules="emailRules"
          v-model="emailVal"
          placeholder="请输入邮箱"
        />
        <ValidateInput
          title="昵称"
          :rules="nicknameRules"
          v-model="nicknameVal"
          placeholder="请输入昵称"
        />
        <ValidateInput
          type="password"
          :title="'密码'"
          :rules="passwordRules"
          v-model="passwordVal"
          placeholder="请输入密码"
        />
        <ValidateInput
          type="password"
          :title="'确认密码'"
          :rules="confirmRules"
          v-model="confirmVal"
          placeholder="请再次确认密码"
        />
        <router-link to="/login">
          <div class="link">已有账号？立即登录!</div>
        </router-link>
      </ValidateForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { useRouter } from "vue-router";
import { request } from "@/request";
import ValidateInput, {
  RulesProp,
} from "@/components/validate-form/ValidateInput.vue";
import ValidateForm from "@/components/validate-form/ValidateForm.vue";
import { createMessage } from "@/components/message/Message.vue";
import { createCenterMessage } from "@/components/message/CenterMessage.vue";

export default defineComponent({
  name: "Register",
  components: { ValidateInput, ValidateForm },
  setup() {
    const { emailVal, emailRules } = useEmailInput();
    const { nicknameVal, nicknameRules } = useNicknameInput();
    const { passwordVal, passwordRules } = usePasswordInput();
    const { confirmVal, confirmRules } = useConfirmInput(passwordVal);
    const { formSubmit } = useFormSubmit(emailVal, passwordVal, nicknameVal);

    return {
      emailVal,
      emailRules,
      nicknameVal,
      nicknameRules,
      passwordVal,
      passwordRules,
      confirmVal,
      confirmRules,
      formSubmit,
    };
  },
});

const useEmailInput = () => {
  const emailVal = ref<string>("");
  const emailRules: RulesProp = [
    {
      type: "required",
      message: "邮箱不能为空",
    },
    {
      type: "email",
      message: "邮箱不符合要求",
    },
  ];

  return { emailVal, emailRules };
};

const useNicknameInput = () => {
  const nicknameVal = ref<string>("");
  const nicknameRules: RulesProp = [
    {
      type: "required",
      message: "昵称不能为空",
    },
    {
      type: "custom",
      validator: () => nicknameVal.value.trim().length >= 2,
      message: "昵称长度要大于等于2位",
    },
  ];

  return { nicknameVal, nicknameRules };
};

const usePasswordInput = () => {
  const passwordVal = ref<string>("");
  const passwordRules: RulesProp = [
    {
      type: "required",
      message: "密码不能为空",
    },
    {
      type: "custom",
      validator: () => passwordVal.value.trim().length >= 6,
      message: "密码长度不能少于6",
    },
  ];

  return { passwordVal, passwordRules };
};

const useConfirmInput = (passwordVal: Ref<string>) => {
  const confirmVal = ref<string>("");
  const confirmRules: RulesProp = [
    {
      type: "required",
      message: "确认密码不能为空",
    },
    {
      type: "custom",
      validator: () => passwordVal.value === confirmVal.value,
      message: "确认密码与密码不一致",
    },
  ];

  return { confirmVal, confirmRules };
};

const useFormSubmit = (
  emailVal: Ref<string>,
  passwordVal: Ref<string>,
  nicknameVal: Ref<string>
) => {
  const router = useRouter();

  const formSubmit = async (result: boolean) => {
    if (result) {
      request
        .post("/auth/register", {
          email: emailVal.value,
          password: passwordVal.value,
          nickname: nicknameVal.value,
        })
        .then(() => {
          createMessage("注册成功，2秒后自动跳转到登录页面", "success", () => {
            router.push("/login");
          });
        })
        .catch((err) => {
          if (err.error === 2) {
            createCenterMessage(err.data.message);
            return;
          }
          createMessage(err.data.message, "error");
        });
    }
  };

  return { formSubmit };
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.register-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 1rem;
  .register {
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