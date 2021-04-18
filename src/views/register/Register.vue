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
          :rules="nickNameRules"
          v-model="nickNameVal"
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
          :rules="confirmPasswordRules"
          v-model="confirmPasswordVal"
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
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import ValidateInput, {
  RulesProp,
} from "@/components/validate-form/ValidateInput.vue";

import ValidateForm from "@/components/validate-form/ValidateForm.vue";

export default defineComponent({
  name: "Login",
  components: { ValidateInput, ValidateForm },
  setup() {
    const router = useRouter();
    const store = useStore();

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

    const nickNameVal = ref<string>("");
    const nickNameRules: RulesProp = [
      {
        type: "required",
        message: "昵称不能为空",
      },
      {
        type: "custom",
        validator: () => nickNameVal.value.trim().length >= 6,
        message: "昵称长度要大于等于6位",
      },
    ];

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

    const confirmPasswordVal = ref<string>("");
    const confirmPasswordRules: RulesProp = [
      {
        type: "required",
        message: "确认密码不能为空",
      },
      {
        type: "custom",
        validator: () => passwordVal.value === confirmPasswordVal.value,
        message: "确认密码与密码不一致",
      },
    ];

    const formSubmit = async (result: boolean) => {
      if (result) {
        await store.dispatch("register", {
          email: emailVal.value,
          password: passwordVal.value,
          nickName: nickNameVal.value,
        });
        router.push("/");
      }
    };

    return {
      emailVal,
      emailRules,
      passwordVal,
      passwordRules,
      confirmPasswordVal,
      confirmPasswordRules,
      nickNameVal,
      nickNameRules,
      formSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.register-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 1rem;
  .register {
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