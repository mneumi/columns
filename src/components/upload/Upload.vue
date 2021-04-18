<template>
  <div class="file-upload">
    <input
      type="file"
      name="file"
      class="none"
      ref="fileInput"
      @change="handleFileChange"
    />
    <div @click="triggerUpload">
      <slot v-if="fileUploadStatus === 'uploading'" name="uploading">
        <span>正在上传...</span>
      </slot>
      <slot
        v-else-if="fileUploadStatus === 'success'"
        name="success"
        :uploadedData="uploadedData"
      >
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
import { PropType, ref, defineComponent } from "vue";
import axios from "axios";

type UploadStatus = "ready" | "uploading" | "success" | "error";

type BeforeUploadFunction = (file: File) => boolean;

export default defineComponent({
  props: {
    action: {
      type: String,
      required: true,
    },
    beforeUpload: {
      type: Function as PropType<BeforeUploadFunction>,
    },
  },
  emits: ["uploaded-success", "uploaded-error"],
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null);

    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click(); // 通过代码触发隐藏的 input 控件
      }
    };

    const fileUploadStatus = ref<UploadStatus>("ready"); // 初始状态为 ready

    const uploadedData = ref();

    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;

      if (target.files) {
        const files = Array.from(target.files); // 伪数组转为数组
        const uploadFile = files[0];

        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadFile);
          if (!result) {
            return;
          }
        }

        fileUploadStatus.value = "uploading"; // 更改状态为 uploading

        const formData = new FormData();
        formData.append(uploadFile.name, uploadFile);

        axios
          .post(props.action, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            fileUploadStatus.value = "success"; // 更改状态为 success
            uploadedData.value = res.data;
            context.emit("uploaded-success", res.data);
          })
          .catch((err) => {
            fileUploadStatus.value = "error"; // 更改状态为 error
            context.emit("uploaded-error", err);
          })
          .finally(() => {
            if (fileInput.value) {
              fileInput.value.value = ""; // 重置 input标签的值
            }
          });
      }
    };

    return {
      fileInput,
      triggerUpload,
      handleFileChange,
      uploadedData,
      fileUploadStatus,
    };
  },
});
</script>

<style>
.file-upload {
  display: flex;
  justify-content: center;
  align-items: center;
}
.none {
  display: none; /* 隐藏 input 按钮 */
}
</style>