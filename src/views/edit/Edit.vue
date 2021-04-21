<template>
  <div class="edit-wrapper">
    <div class="edit">
      <div class="tab-bar">
        <div
          class="item"
          :class="{ selected: index === tabIndex }"
          v-for="(item, index) in tabList"
          :key="index"
          @click="() => changeTabIndex(index)"
        >
          {{ item }}
        </div>
      </div>
      <template v-if="tabIndex === 0">
        <div class="upload-wrapper">
          <div class="title">编辑个人资料</div>
          <Upload
            action="/upload"
            @uploaded-success="handleUserAvatarUploadedSuccess"
            @uploaded-error="handleUserAvatarUploadedError"
          >
            <template #default>
              <div class="upload-img">点击上传头像</div>
            </template>
            <template #uploading>
              <div class="upload-img">上传中...</div>
            </template>
            <template #success>
              <div class="upload-img">
                <img :src="userAvatarUrl" />
              </div>
            </template>
            <template #error>
              <div class="upload-img">上传失败</div>
            </template>
          </Upload>
        </div>
        <ValidateForm
          btnName="提交修改"
          btnWidth="1.1rem"
          @form-submit="submitUserForm"
        >
          <ValidateInput
            placeholder="请输入昵称"
            v-model="nicknamedVal"
            :rules="nicknameRules"
            title="设置昵称"
          />
          <ValidateInput
            :inputType="'textarea'"
            placeholder="请输入个人简介"
            rows="10"
            v-model="userDescVal"
            :rules="userDescRules"
            title="设置简介"
          />
        </ValidateForm>
      </template>
      <template v-if="tabIndex === 1">
        <div class="upload-wrapper">
          <div class="title">编辑专栏信息</div>
          <Upload
            action="/upload"
            @uploaded-success="handleColumnAvatarUploadedSuccess"
            @uploaded-error="handleColumnAvatarUploadedError"
          >
            <template #default>
              <div class="upload-img">点击上传专栏头图</div>
            </template>
            <template #uploading>
              <div class="upload-img">上传中...</div>
            </template>
            <template #success>
              <div class="upload-img">
                <img :src="columnAvatarUrl" />
              </div>
            </template>
            <template #error>
              <div class="upload-img">上传失败</div>
            </template>
          </Upload>
        </div>
        <ValidateForm
          btnName="提交修改"
          btnWidth="1.1rem"
          @form-submit="submitColumnForm"
        >
          <ValidateInput
            placeholder="请输入专栏名称"
            v-model="columnNameVal"
            :rules="columnNameRules"
            title="设置专栏名称"
          />
          <ValidateInput
            :inputType="'textarea'"
            placeholder="请输入专栏简介"
            rows="10"
            v-model="columnDescVal"
            :rules="columnDescRules"
            title="设置专栏简介"
          />
        </ValidateForm>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { createMessage } from "@/components/message/Message.vue";
import { useStore } from "vuex";
import ValidateForm from "@/components/validate-form/ValidateForm.vue";
import ValidateInput, {
  RulesProp,
} from "@/components/validate-form/ValidateInput.vue";
import Upload from "@/components/upload/Upload.vue";
import { IStore } from "@/interface";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Edit",
  components: {
    ValidateForm,
    ValidateInput,
    Upload,
  },
  setup() {
    const router = useRouter();
    const store = useStore<IStore>();
    const tabIndex = ref(0);
    const tabList = ["更新个人资料", "更新专栏信息"];
    const changeTabIndex = (index: number) => (tabIndex.value = index);

    onMounted(() => {
      store.dispatch("getColumnInfo");
    });

    const nickname = store.state.user.nickname;

    const userDesc = store.state.user.desc;

    const nicknamedVal = ref<string>(nickname);
    const nicknameRules: RulesProp = [
      {
        type: "required",
        message: "昵称不能为空",
      },
      {
        type: "custom",
        message: "昵称长度不能超过10位",
        validator: () => nicknamedVal.value.length <= 10,
      },
    ];

    const userDescVal = ref<string>(userDesc);
    const userDescRules: RulesProp = [
      {
        type: "required",
        message: "用户简介不能为空",
      },
      {
        type: "custom",
        message: "用户简介不能超过20位",
        validator: () => userDescVal.value.length <= 20,
      },
    ];

    const columnNameVal = ref<string>(store.state.columnInfo.title);
    const columnNameRules: RulesProp = [
      {
        type: "required",
        message: "专栏名称不能为空",
      },
      {
        type: "custom",
        message: "专栏名称长度不能超过10位",
        validator: () => columnNameVal.value.length <= 10,
      },
    ];

    const columnDescVal = ref<string>(store.state.columnInfo.desc);
    const columnDescRules: RulesProp = [
      {
        type: "required",
        message: "专栏简介不能为空",
      },
      {
        type: "custom",
        message: "专栏简介长度不能超过20位",
        validator: () => columnDescVal.value.length <= 20,
      },
    ];

    watch(
      () => store.state.columnInfo,
      (columnInfo) => {
        columnNameVal.value = columnInfo.title;
        columnDescVal.value = columnInfo.desc;
      }
    );

    const userAvatarUrl = ref<string>(store.state.user.avatar);

    const handleUserAvatarUploadedSuccess = (data: any) => {
      userAvatarUrl.value = data.data.url;
    };

    const handleUserAvatarUploadedError = (err: any) => {
      console.log(err);
    };

    const columnAvatarUrl = ref<string>("");

    const handleColumnAvatarUploadedSuccess = (data: any) => {
      columnAvatarUrl.value = data.data.url;
    };

    const handleColumnAvatarUploadedError = (err: any) => {
      console.log(err);
    };

    const submitUserForm = (result: boolean) => {
      if (result) {
        try {
          const payload = {
            ...store.state.user,
            nickname: nicknamedVal.value,
            desc: userDescVal.value,
            avatar: userAvatarUrl.value,
          };
          store.dispatch("updateUserInfo", payload);
          console.log("??", store.state.user);
          createMessage("登录成功，2秒后跳转到主页", "success", () =>
            router.push("/")
          );
        } catch (err) {
          const errContent = err.data?.message || "网络发生错误";
          store.commit("setMessage", { content: errContent, type: "error" });
        }
      } else {
        store.commit("setMessage", {
          content: "表单填写有误，请检查",
          type: "error",
        });
      }
    };

    const submitColumnForm = (result: boolean) => {
      if (result) {
        const payload = {
          ...store.state.columnInfo,
          title: columnNameVal.value,
          description: columnDescVal.value,
          avatar: columnAvatarUrl.value,
        };
        console.log("Edit.vue: ", payload);
        store.dispatch("updateColumnInfo", payload);
      } else {
        console.log("no pass");
      }
    };

    return {
      submitUserForm,
      submitColumnForm,
      tabList,
      tabIndex,
      changeTabIndex,
      columnDescVal,
      columnDescRules,
      columnNameRules,
      columnNameVal,
      userDescVal,
      userDescRules,
      nicknameRules,
      nicknamedVal,
      handleUserAvatarUploadedSuccess,
      handleUserAvatarUploadedError,
      userAvatarUrl,
      handleColumnAvatarUploadedSuccess,
      handleColumnAvatarUploadedError,
      columnAvatarUrl,
    };
  },
});
</script>

<style lang="scss" scoped>
.edit-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1rem;
  .edit {
    width: 8rem;
    .tab-bar {
      margin: 0.3rem 0;
      display: flex;
      font-size: 0.18rem;
      .item {
        box-sizing: border-box;
        padding: 0.1rem 0.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0.01rem solid #dee2e6;
        border-radius: 0.04rem;
        margin-right: 0.2rem;
        &:hover {
          cursor: pointer;
          border: 0.01rem solid #0d6efd;
          color: #0d6efd;
        }
      }
      .selected {
        color: #0d6efd;
        border: 0.01rem solid #0d6efd;
      }
    }
    .upload-wrapper {
      margin-bottom: 0.5rem;
      .title {
        font-size: 0.22rem;
        margin-bottom: 0.3rem;
      }
      .upload-img {
        width: 2.7rem;
        height: 2.7rem;
        border-radius: 50% !important;
        background-color: #f8f9fa;
        border-radius: 0.07rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #6c757d;
        font-size: 0.35rem;
        margin-bottom: 0.2rem;
        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>