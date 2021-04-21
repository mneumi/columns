<template>
  <div class="write-wrapper">
    <div class="title">新建文章</div>
    <Upload
      action="/upload"
      :beforeUpload="uploadCheck"
      @uploaded-error="(err) => handleUploadedError(err)"
      @uploaded-success="(data) => handleUploadedSuccess(data)"
    >
      <template #default>
        <div class="upload-img">点击上传头图</div>
      </template>
      <template #uploading>
        <div class="upload-img">上传中</div>
      </template>
      <template v-slot:success>
        <div class="upload-img">
          <img :src="pictureVal" />
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
          rows="10"
          title="文章详情"
          placeholder="请输入文章详情（使用markdown）"
          v-model="contentVal"
          :rules="contentRules"
          :inputType="'markdown'"
        />
      </ValidateForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { useStore } from "vuex";
import { IStore } from "@/interface";
import { beforeUploadCheck } from "@/utils";
import ValidateForm from "@/components/validate-form/ValidateForm.vue";
import ValidateInput, {
  RulesProp,
} from "@/components/validate-form/ValidateInput.vue";
import Upload from "@/components/upload/Upload.vue";
import { createMessage } from "@/components/message/Message.vue";
import { useRouter } from "node_modules/vue-router/dist/vue-router";

const useTitleInput = () => {
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

  return { titleVal, titleRules };
};

const useContentInput = () => {
  const contentVal = ref<string>("");
  const contentRules: RulesProp = [
    {
      type: "required",
      message: "文章详情不能为空",
    },
  ];

  return { contentVal, contentRules };
};

const usePicture = () => {
  const pictureVal = ref<string>("");

  return { pictureVal };
};

const useUpload = (pictureVal: Ref<string>) => {
  const handleUploadedSuccess = (data: { data: { url: string } }) => {
    console.log(data);
    pictureVal.value = data.data.url;
  };

  const handleUploadedError = (err: {
    error: number;
    data: { message: string };
  }) => {
    createMessage(err.data.message, "error");
  };

  const uploadCheck = (file: File) => {
    const result = beforeUploadCheck(file, {
      format: ["image/jpeg", "image/png"],
      size: 1,
    });

    const { passed, error } = result;

    if (error === "format") {
      createMessage("上传图片只能是 JPG/PNG 格式!", "error");
    }

    if (error === "size") {
      createMessage("上传图片不能超过 1Mb", "error");
    }

    return passed;
  };

  return { handleUploadedSuccess, handleUploadedError, uploadCheck };
};

const useFormSubmit = (
  titleVal: Ref<string>,
  contentVal: Ref<string>,
  pictureVal: Ref<string>
) => {
  const router = useRouter();
  const store = useStore<IStore>();

  const formSubmit = (result: boolean) => {
    if (result) {
      try {
        const payload = {
          title: titleVal.value,
          content: contentVal.value,
          picture: pictureVal.value,
        };
        store.dispatch("writePost", payload);
        createMessage("创建文章成功，2秒后跳转到文章首页", "success", () => {
          setTimeout(() => {
            router.push("/");
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return { formSubmit };
};

export default defineComponent({
  name: "Write",
  components: { ValidateForm, ValidateInput, Upload },
  setup() {
    const { titleVal, titleRules } = useTitleInput();
    const { contentVal, contentRules } = useContentInput();
    const { pictureVal } = usePicture();
    const {
      handleUploadedSuccess,
      handleUploadedError,
      uploadCheck,
    } = useUpload(pictureVal);
    const { formSubmit } = useFormSubmit(titleVal, contentVal, pictureVal);

    return {
      formSubmit,
      titleVal,
      titleRules,
      contentVal,
      contentRules,
      handleUploadedSuccess,
      handleUploadedError,
      pictureVal,
      uploadCheck,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.write-wrapper {
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
    background-color: $light-white-color;
    border-radius: 0.07rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $light-grey-color;
    font-size: 0.35rem;
    margin-bottom: 0.2rem;
    img {
      width: 100%;
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