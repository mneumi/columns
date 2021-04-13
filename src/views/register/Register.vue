<template>
  <ValidateForm formName="注册新账号" btnName="注册">
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
    <ValidateInput
      type="password"
      :title="'确认密码'"
      :rules="passwordRules"
      v-model="passwordVal"
      placeholder="请再次确认密码"
    />
    <router-link to="/login">
      <div class="link">已有账号？立即登录!</div>
    </router-link>
  </ValidateForm>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import ValidateInput, {
  RulesProp,
} from "../../components/validate-form/ValidateInput.vue";

import ValidateForm from "../../components/validate-form/ValidateForm.vue";

export default defineComponent({
  name: "Login",
  components: { ValidateInput, ValidateForm },
  setup() {
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

    return {
      usernameVal,
      usernameRules,
      passwordVal,
      passwordRules
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