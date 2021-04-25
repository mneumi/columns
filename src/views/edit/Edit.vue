<template>
  <div class="edit-wrapper">
    <div class="edit">
      <div class="tab-bar">
        <div
          class="item"
          :class="{ selected: index === tabIndex }"
          v-for="(tabTitle, index) in tabList"
          :key="index"
          @click="() => changeTabIndex(index)"
        >
          {{ tabTitle }}
        </div>
      </div>
      <EditUser v-if="tabIndex === 0" />
      <EditColumn v-if="tabIndex === 1" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import EditUser from "./EditUser.vue";
import EditColumn from "./EditColumn.vue";

export default defineComponent({
  name: "Edit",
  components: { EditUser, EditColumn },
  setup() {
    const { tabIndex, tabList, changeTabIndex } = useTabList();

    return { tabList, tabIndex, changeTabIndex };
  },
});

const useTabList = () => {
  const tabIndex = ref(0);
  const tabList = ["更新个人资料", "更新专栏信息"];
  const changeTabIndex = (index: number) => (tabIndex.value = index);

  return { tabIndex, tabList, changeTabIndex };
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

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
        border: 0.01rem solid $middle-grey-color;
        border-radius: 0.04rem;
        margin-right: 0.2rem;
        &:hover {
          cursor: pointer;
          border: 0.01rem solid $primary-color;
          color: $primary-color;
        }
      }
      .selected {
        color: $primary-color;
        border: 0.01rem solid $primary-color;
      }
    }
  }
}
</style>