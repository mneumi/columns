<template>
  <div
    class="dropdown"
    ref="dropdownRef"
    v-show="showDropdown"
    @click.stop="switchDropdown"
  >
    <div class="dropdown-item" @click="writePost">新建文章</div>
    <div class="dropdown-item" @click="myColumn">我的专栏</div>
    <div class="dropdown-item" @click="editProfile">编辑资料</div>
    <div class="dropdown-item" @click="logout">退出登录</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { IStore } from "@/interface";

export default defineComponent({
  name: "Dropdown",
  setup() {
    const { dropdownRef, showDropdown, switchDropdown } = useDropdown();
    const { logout, writePost, editProfile, myColumn } = useBtnClick(
      switchDropdown
    );

    return {
      dropdownRef,
      showDropdown,
      switchDropdown,
      logout,
      writePost,
      editProfile,
      myColumn,
    };
  },
});

const useDropdown = () => {
  const dropdownRef = ref<null | HTMLElement>(null);
  const showDropdown = ref<boolean>(false);

  const switchDropdown = () => {
    showDropdown.value = !showDropdown.value;
  };

  const clickOutside = (e: MouseEvent) => {
    if (dropdownRef.value) {
      if (
        !dropdownRef.value.contains(e.target as HTMLElement) &&
        showDropdown.value
      ) {
        showDropdown.value = false;
      }
    }
  };

  onMounted(() => {
    document.addEventListener("click", clickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener("click", clickOutside);
  });

  return { dropdownRef, showDropdown, switchDropdown };
};

const useBtnClick = (switchDropdown: () => void) => {
  const router = useRouter();
  const store = useStore<IStore>();

  const logout = () => {
    store.commit("logout");
    router.push("/");
    switchDropdown();
  };

  const writePost = () => {
    router.push("/write");
  };

  const editProfile = () => {
    router.push("/edit");
  };

  const myColumn = () => {
    const columnId = store.state.user.columnId;

    router.push(`/columns/${columnId}`);
  };

  return { logout, writePost, editProfile, myColumn };
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/mixins.scss";

.dropdown {
  width: 1.1rem;
  position: absolute;
  background-color: $white-color;
  padding: 0.04rem;
  left: 0.09rem;
  top: 0.6rem;
  border: 0.01rem solid $grey-color;
  border-radius: 0.05rem;
  z-index: 100;
  .dropdown-item {
    padding: 0.1rem 0;
    @include center;
    &:hover {
      cursor: pointer;
      background-color: $primary-color;
      border-radius: 0.05rem;
      color: $white-color;
    }
    &:last-child {
      margin: 0;
    }
  }
}
</style>