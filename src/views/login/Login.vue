<template>
  <ValidateForm formName="登录专栏" btnName="登录" @form-submit="formSubmit">
    <ValidateInput
      title="用户名"
      :rules="usernameRules"
      v-model="usernameVal"
      placeholder="请输入用户名"
    />
    <ValidateInput
      type="password"
      :title="'密码'"
      :rules="passwordRules"
      v-model="passwordVal"
      placeholder="请输入密码"
    />
    <router-link to="/register">
      <div class="link">还没有账号？立即注册!</div>
    </router-link>
  </ValidateForm>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import ValidateInput, {
  RulesProp,
} from "../../components/validate-form/ValidateInput.vue";

import ValidateForm from "../../components/validate-form/ValidateForm.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalDataProps } from "@/store";

export default defineComponent({
  name: "Login",
  components: { ValidateInput, ValidateForm },
  setup() {
    const store = useStore<GlobalDataProps>();
    const router = useRouter();
    const usernameVal = ref<string>("");
    const usernameRules: RulesProp = [
      {
        type: "required",
        message: "用户名不能为空",
      },
      {
        type: "length>=6",
        message: "用户名长度要大于等于6位",
      },
    ];

    const passwordVal = ref<string>("");
    const passwordRules: RulesProp = [
      {
        type: "required",
        message: "密码不能为空",
      },
    ];

    const formSubmit = (result: boolean) => {
      if (result) {
        store.commit("login");
        router.push("/");
      }
    };

    return {
      usernameVal,
      usernameRules,
      passwordVal,
      passwordRules,
      formSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.link {
  color: blue;
  margin: 0.2rem 0;
  &:hover {
    cursor: pointer;
  }
}
</style>