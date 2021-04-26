<template>
  <div class="upload-wrapper">
    <div class="title">编辑专栏信息</div>
    <Upload
      action="/upload"
      :uploaded="imageUrl"
      @uploaded-success="handleUploadedSuccess"
      @uploaded-error="handleUploadedError"
    >
      <template #default>
        <div class="upload-img">点击上传头图</div>
      </template>
      <template #uploading>
        <div class="upload-img">上传中...</div>
      </template>
      <template #success>
        <div class="upload-img">
          <img :src="imageUrl" />
        </div>
      </template>
      <template #error>
        <div class="upload-img">上传失败</div>
      </template>
    </Upload>
  </div>
  <ValidateForm btnName="提交修改" btnWidth="1.1rem" @form-submit="submitForm">
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
      v-model="descVal"
      :rules="descRules"
      title="设置专栏简介"
    />
  </ValidateForm>
</template>

<script lang="ts">
import { ref, Ref } from "vue";
import { useStore } from "vuex";
import { defineComponent } from "vue";
import { request } from "@/request";
import { IStore } from "@/interface";
import { createMessage } from "@/components/message/Message.vue";
import Upload from "@/components/upload/Upload.vue";
import ValidateForm from "@/components/validate-form/ValidateForm.vue";
import ValidateInput, {
  RulesProp,
} from "@/components/validate-form/ValidateInput.vue";
import { createCenterMessage } from "@/components/message/CenterMessage.vue";

export default defineComponent({
  name: "EditColumn",
  components: { Upload, ValidateForm, ValidateInput },
  setup() {
    const { columnNameVal, columnNameRules } = useColumnName();
    const { descVal, descRules } = useDesc();
    const {
      imageUrl,
      handleUploadedSuccess,
      handleUploadedError,
    } = useUpload();
    const { submitForm } = useSubmitForm(columnNameVal, descVal, imageUrl);

    return {
      columnNameVal,
      columnNameRules,
      descVal,
      descRules,
      imageUrl,
      handleUploadedSuccess,
      handleUploadedError,
      submitForm,
    };
  },
});

const useColumnName = () => {
  const store = useStore<IStore>();

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

  return { columnNameVal, columnNameRules };
};

const useDesc = () => {
  const store = useStore<IStore>();

  const descVal = ref<string>(store.state.columnInfo.desc);
  const descRules: RulesProp = [
    {
      type: "required",
      message: "专栏简介不能为空",
    },
    {
      type: "custom",
      message: "专栏简介长度不能超过20位",
      validator: () => descVal.value.length <= 20,
    },
  ];

  return { descVal, descRules };
};

const useUpload = () => {
  const store = useStore<IStore>();

  const imageUrl = ref<string>(store.state.columnInfo.picture);

  const handleUploadedSuccess = (data: { url: string }) => {
    imageUrl.value = data.url;
  };

  const handleUploadedError = (err: {
    error: number;
    data: { message: string };
  }) => {
    if (err.error === 2) {
      createCenterMessage(err.data.message);
    } else {
      createMessage(err.data.message, "error");
    }
  };

  return { imageUrl, handleUploadedSuccess, handleUploadedError };
};

const useSubmitForm = (
  columnNameVal: Ref<string>,
  descVal: Ref<string>,
  imageVal: Ref<string>
) => {
  const store = useStore<IStore>();

  const submitForm = (result: boolean) => {
    if (result) {
      const payload = {
        ...store.state.columnInfo,
        title: columnNameVal.value,
        desc: descVal.value,
        picture: imageVal.value,
      };
      request
        .put(`/columns/${store.state.user.columnId}`, payload)
        .then(() => {
          return store.dispatch("getColumnInfo");
        })
        .then(() => {
          createMessage("更新成功", "success");
        })
        .catch((err) => {
          if (err.error === 2) {
            createCenterMessage(err.data.message);
          } else {
            createMessage(err.data.message, "error");
          }
        });
    } else {
      createMessage("表单填写有误，请检查", "error");
    }
  };

  return { submitForm };
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/mixins.scss";

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
    background-color: $light-white-color;
    border-radius: 0.07rem;
    color: $light-grey-color;
    font-size: 0.35rem;
    margin-bottom: 0.2rem;
    @include center;
    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }
  }
}
</style>