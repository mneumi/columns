<template>
  <div class="file-upload">
    <input
      type="file"
      name="myFile"
      class="none"
      ref="fileInput"
      @change="handleFileChange"
    />
    <div @click="triggerUpload">
      <slot v-if="fileUploadStatus === 'uploading'" name="uploading">
        <span>正在上传...</span>
      </slot>
      <slot v-else-if="fileUploadStatus === 'success'" name="success">
        <span>上传成功！</span>
      </slot>
      <slot v-else-if="fileUploadStatus === 'error'" name="error">
        <span>上传失败！</span>
      </slot>
      <slot v-else name="default">
        <span>点击上传</span>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, ref, defineComponent, watch, Ref, SetupContext } from "vue";
import { request } from "@/request";

type UploadStatus = "ready" | "uploading" | "success" | "error";
type BeforeUploadFunction = (file: File) => boolean;

export default defineComponent({
  name: "Upload",
  emits: ["uploaded-success", "uploaded-error"],
  props: {
    action: {
      type: String,
      required: true,
    },
    beforeUpload: {
      type: Function as PropType<BeforeUploadFunction>,
    },
    uploaded: {
      type: String,
      required: false,
    },
  },
  setup(props, context) {
    const { fileInput, triggerUpload } = useFileInput();
    const { fileUploadStatus } = useFileUploadStatus(props);
    const { handleFileChange } = useHandleFileChange(
      props,
      context,
      fileInput,
      fileUploadStatus
    );

    return {
      fileInput,
      triggerUpload,
      handleFileChange,
      fileUploadStatus,
    };
  },
});

const useFileInput = () => {
  const fileInput = ref<null | HTMLInputElement>(null);

  const triggerUpload = () => {
    if (fileInput.value) {
      fileInput.value.click();
    }
  };

  return { fileInput, triggerUpload };
};

const useFileUploadStatus = (props: {
  action: string;
  beforeUpload?: BeforeUploadFunction | undefined;
  uploaded?: string | undefined;
}) => {
  const fileUploadStatus = ref<UploadStatus>(
    props.uploaded ? "success" : "ready"
  );

  watch(
    () => props.uploaded,
    (newVal) => {
      if (newVal) {
        fileUploadStatus.value = "success";
      } else {
        fileUploadStatus.value = "ready";
      }
    }
  );

  return { fileUploadStatus };
};

const useHandleFileChange = (
  props: {
    action: string;
    beforeUpload?: BeforeUploadFunction | undefined;
    uploaded?: string | undefined;
  },
  context: SetupContext<("uploaded-success" | "uploaded-error")[]>,
  fileInput: Ref<HTMLInputElement | null>,
  fileUploadStatus: Ref<UploadStatus>
) => {
  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;

    if (target.files) {
      const files = Array.from(target.files);
      const uploadFile = files[0];

      if (props.beforeUpload) {
        const result = props.beforeUpload(uploadFile);
        if (!result) {
          return;
        }
      }

      fileUploadStatus.value = "uploading";

      const formData = new FormData();
      formData.append(uploadFile.name, uploadFile);

      request
        .post(props.action, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          fileUploadStatus.value = "success";
          context.emit("uploaded-success", res.data);
        })
        .catch((err) => {
          fileUploadStatus.value = "error";
          context.emit("uploaded-error", err);
        })
        .finally(() => {
          if (fileInput.value) {
            fileInput.value.value = "";
          }
        });
    }
  };

  return { handleFileChange };
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/mixins.scss";

.file-upload {
  @include center;
}
.none {
  display: none;
}
</style>