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
          :title="'密码'"
          :rules="passwordRules"
          v-model="passwordVal"
          placeholder="请输入密码"
        />
        <router-link to="/login">
          <div class="link">还没有账号？立即注册!</div>
        </router-link>
      </ValidateForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import ValidateInput, {
  RulesProp,
} from "../../components/validate-form/ValidateInput.vue";

import ValidateForm from "../../components/validate-form/ValidateForm.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { IStore } from "@/interface";
import { createMessage } from '@/components/message/Message.vue';

export default defineComponent({
  name: "Login",
  components: { ValidateInput, ValidateForm },
  setup() {
    const store = useStore<IStore>();
    const router = useRouter();
    const emailVal = ref<string>("");
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

    const passwordVal = ref<string>("");
    const passwordRules: RulesProp = [
      {
        type: "required",
        message: "密码不能为空",
      },
    ];

    const formSubmit = async (result: boolean) => {
      if (result) {
        await store.dispatch("login", {
          email: emailVal.value,
          password: passwordVal.value,
        });
        createMessage("登录成功，2秒后跳转到主页", "success", 2000);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    };

    return {
      emailVal,
      emailRules,
      passwordVal,
      passwordRules,
      formSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.login-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 1rem;
  .login {
    width: 6rem;
    margin-top: 0.6rem;
    .link {
      color: #0d6efd;
      margin: 0.2rem 0;
      &:hover {
        cursor: pointer;
      }
      text-align: center;
    }
  }
}
</style>