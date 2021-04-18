<template>
  <div class="create-wrapper">
    <div class="title">新建文章</div>
    <Upload
      action="/upload"
      @uploaded-error="(err) => handleUploadedError(err)"
      @uploaded-success="(data) => handleUploadedSuccess(data)"
    >
      <template #default>
        <div class="upload-img">点击上传头图</div>
      </template>
      <template #uploading>
        <div class="upload-img">上传中</div>
      </template>
      <template v-slot:success="{ uploadedData }">
        <div class="upload-img">
          <img :src="uploadedData.data.url" />
        </div>
      </template>
      <template #error>
        <div class="upload-img">上传失败</div>
      </template>
    </Upload>
    <div class="form">
      <ValidateForm
        btnName="发表文章"
        btnWidth="1rem"
        @form-submit="formSubmit"
      >
        <ValidateInput
          title="文章标题"
          placeholder="请输入文章标题"
          v-model="titleVal"
          :rules="titleRules"
        />
        <ValidateInput
          title="文章详情"
          :inputType="'textarea'"
          placeholder="请输入文章详情"
          rows="10"
          v-model="contentVal"
          :rules="contentRules"
        />
      </ValidateForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ValidateForm from "@/components/validate-form/ValidateForm.vue";
import ValidateInput, {
  RulesProp,
} from "@/components/validate-form/ValidateInput.vue";
import Upload from "@/components/upload/Upload.vue";

export default defineComponent({
  name: "Create",
  components: {
    ValidateForm,
    ValidateInput,
    Upload,
  },
  setup() {
    const formSubmit = (result: boolean) => {
      console.log(result);
    };

    const titleVal = ref<string>("");
    const titleRules: RulesProp = [
      {
        type: "required",
        message: "文章标题不能为空",
      },
      {
        type: "custom",
        message: "文章标题不能超过20个字",
        validator: () => titleVal.value.length <= 20,
      },
    ];

    const contentVal = ref<string>("");
    const contentRules: RulesProp = [
      {
        type: "required",
        message: "文章详情不能为空",
      },
    ];

    const handleUploadedSuccess = (data: any) => {
      console.log(data);
    };

    const handleUploadedError = (err: any) => {
      console.log(err);
    };

    return {
      formSubmit,
      titleVal,
      titleRules,
      contentVal,
      contentRules,
      handleUploadedSuccess,
      handleUploadedError,
    };
  },
});
</script>

<style lang="scss" scoped>
.create-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1rem;
  .title {
    width: 13rem;
    font-size: 0.28rem;
    margin: 0.3rem 0;
    font-weight: 500;
  }
  .upload-img {
    width: 13rem;
    height: 2.7rem;
    background-color: #f8f9fa;
    border-radius: 0.07rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #6c757d;
    font-size: 0.35rem;
    margin-bottom: 0.2rem;
    img {
      height: 100%;
      object-fit: cover;
    }
  }
  .form {
    display: flex;
    width: 13rem;
  }
}
</style>