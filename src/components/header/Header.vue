<template>
  <div class="header-wrapper">
    <div class="header">
      <div class="title-wrapper">
        <a
          href="https://github.com/mneumi/columns"
          target="_blank"
          class="iconfont"
          >&#xe7ab;</a
        >
        <div class="title" @click="handleTitleClick">
          <div>mneumi 专栏（仅用于演示）</div>
        </div>
      </div>
      <div class="feature">
        <div class="non-login" v-if="!isLogin">
          <div class="login btn" @click="handleLoginClick">登录</div>
          <div class="register btn" @click="handleRegisterClick">注册</div>
        </div>
        <div class="user-info" v-else>
          <div class="title" @click.stop="switchDropdown">
            <span>你好，{{ username }}</span>
          </div>
          <Dropdown ref="dropdownRef" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { IStore } from "@/interface";
import Dropdown from "./Dropdown.vue";

export default defineComponent({
  name: "Header",
  components: { Dropdown },
  setup() {
    const { username, isLogin } = useUserInfo();
    const {
      handleTitleClick,
      handleRegisterClick,
      handleLoginClick,
    } = useHeaderClick();
    const { dropdownRef, switchDropdown } = useDropdown();

    return {
      handleTitleClick,
      handleLoginClick,
      handleRegisterClick,
      isLogin,
      username,
      dropdownRef,
      switchDropdown,
    };
  },
});

const useUserInfo = () => {
  const store = useStore<IStore>();

  if (!store.state.user.nickname) {
    if (localStorage.getItem("userInfo") !== null) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
      store.commit("getUserInfo", userInfo);
    } else if (store.state.token) {
      store.dispatch("getUserInfo");
    }
  }

  const username = computed(() => {
    return store.state.user.nickname;
  });

  const isLogin = computed(() => {
    return store.state.token !== "";
  });

  return { username, isLogin };
};

const useHeaderClick = () => {
  const router = useRouter();

  const handleTitleClick = () => {
    router.push("/");
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return {
    handleTitleClick,
    handleRegisterClick,
    handleLoginClick,
  };
};

const useDropdown = () => {
  const dropdownRef = ref();

  const switchDropdown = () => {
    dropdownRef.value.switchDropdown();
  };

  return { dropdownRef, switchDropdown };
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/mixins.scss";

.header-wrapper {
  width: 100%;
  height: 0.7rem;
  background-color: $primary-color;
  .header {
    width: 12rem;
    height: 0.7rem;
    margin: 0 auto;
    background-color: $primary-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title-wrapper {
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 0.28rem;
        color: $white-color;
      }
      .title {
        color: $white-color;
        font-size: 0.2rem;
        margin-left: 0.16rem;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .feature {
      height: 0.7rem;
      display: flex;
      align-items: center;
      .non-login {
        height: 0.7rem;
        @include center;
        .btn {
          width: 0.7rem;
          height: 0.4rem;
          font-size: 0.14rem;
          border: 0.01rem solid $white-color;
          color: $white-color;
          margin: 0 0.05rem;
          border-radius: 0.05rem;
          @include center;
          &:hover {
            cursor: pointer;
            background-color: $white-color;
            color: $black-color;
          }
        }
      }
      .user-info {
        height: 0.7rem;
        position: relative;
        @include center;
        .title {
          font-size: 0.14rem;
          height: 0.4rem;
          border: 0.01rem solid $white-color;
          margin: 0.1rem;
          padding: 0.1rem;
          box-sizing: border-box;
          border-radius: 0.07rem;
          color: $white-color;
          @include center;
          &:hover {
            cursor: pointer;
            color: $black-color;
            background-color: $white-color;
          }
        }
      }
    }
  }
}
</style>