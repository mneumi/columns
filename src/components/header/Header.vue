<template>
  <div class="header-wrapper">
    <div class="header">
      <div class="title" @click="handleTitleClick">
        mneumi 专栏（仅用于演示）
      </div>
      {{ userId }}
      <div class="feature">
        <div class="non-login" v-if="!isLogin">
          <div class="login btn" @click="handleLoginClick">登录</div>
          <div class="register btn" @click="handleRegisterClick">注册</div>
        </div>
        <div class="user-info" v-else>
          <div class="title" @click.stop="changeShowDropdown">
            <span>你好，{{ username }}</span>
          </div>
          <div class="dropdown" v-show="showDropdown" ref="dropdownRef">
            <div class="dropdown-item">新建文章</div>
            <div class="dropdown-item" @click="editProfile">编辑资料</div>
            <div class="dropdown-item" @click="logout">退出登录</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IStore } from "@/interface";
import { defineComponent, ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const useDropdown = () => {
  const dropdownRef = ref<null | HTMLElement>(null);
  const showDropdown = ref<boolean>(false);

  const changeShowDropdown = () => {
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

  return {
    dropdownRef,
    showDropdown,
    changeShowDropdown,
  };
};

const useLogin = () => {
  const router = useRouter();
  const store = useStore<IStore>();

  const isLogin = computed(() => {
    return store.state.token !== "";
  });

  const handleLoginClick = () => {
    router.push("/login");
  };

  return {
    isLogin,
    handleLoginClick,
  };
};

const useRegister = () => {
  const router = useRouter();

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return { handleRegisterClick };
};

const useTitle = () => {
  const router = useRouter();

  const handleTitleClick = () => {
    router.push("/");
  };

  return { handleTitleClick };
};

const useLogout = (changeShowDropdown: () => void) => {
  const router = useRouter();
  const store = useStore();

  const logout = () => {
    store.commit("logout");
    router.push("/");
    changeShowDropdown();
  };

  return { logout };
};

const useUserInfo = () => {
  const store = useStore<IStore>();

  if (!store.state.user.nickName) {
    if (localStorage.getItem("userInfo") !== null) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
      store.commit("getUserInfo", userInfo);
    } else if (store.state.token) {
      store.dispatch("getUserInfo");
    }
  }

  const username = computed(() => {
    return store.state.user.nickName;
  });

  const userId = computed(() => {
    return store.state.user._id;
  });

  return { username, userId };
};

const useEditProfile = () => {
  const router = useRouter();

  const editProfile = () => {
    router.push("/edit");
  };

  return {
    editProfile
  }
};

export default defineComponent({
  name: "Header",
  setup() {
    const { dropdownRef, showDropdown, changeShowDropdown } = useDropdown();
    const { isLogin, handleLoginClick } = useLogin();
    const { handleRegisterClick } = useRegister();
    const { handleTitleClick } = useTitle();
    const { username, userId } = useUserInfo();
    const { logout } = useLogout(changeShowDropdown);
    const { editProfile } = useEditProfile();

    return {
      showDropdown,
      changeShowDropdown,
      dropdownRef,
      handleTitleClick,
      handleLoginClick,
      handleRegisterClick,
      isLogin,
      username,
      userId,
      logout,
      editProfile
    };
  },
});
</script>

<style lang="scss" scoped>
.header-wrapper {
  width: 100%;
  height: 0.7rem;
  background-color: #0d6efd;
  .header {
    width: 12rem;
    height: 0.7rem;
    margin: 0 auto;
    background-color: #0d6efd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      color: #fff;
      font-size: 0.2rem;
      margin-left: 0.16rem;
      &:hover {
        cursor: pointer;
      }
    }
    .feature {
      height: 0.7rem;
      .non-login {
        height: 0.7rem;
        display: flex;
        align-items: center;
        justify-content: center;
        .btn {
          width: 0.7rem;
          height: 0.4rem;
          font-size: 0.14rem;
          border: 0.01rem solid #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          margin: 0 0.05rem;
          border-radius: 0.05rem;
          &:hover {
            cursor: pointer;
            background-color: #fff;
            color: #000;
          }
        }
      }
      .user-info {
        height: 0.7rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .title {
          font-size: 0.14rem;
          height: 0.4rem;
          border: 0.01rem solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0.1rem;
          padding: 0.1rem;
          box-sizing: border-box;
          border-radius: 0.07rem;
          &:hover {
            cursor: pointer;
          }
        }
        .dropdown {
          width: 1.1rem;
          position: absolute;
          background-color: #fff;
          padding: 0.16rem;
          left: 0.09rem;
          top: 0.6rem;
          border: 0.01rem solid #999;
          border-radius: 0.05rem;
          z-index: 100;
          .dropdown-item {
            margin-bottom: 0.16rem;
            &:hover {
              cursor: pointer;
            }
            &:last-child {
              margin: 0;
            }
          }
        }
      }
    }
  }
}
</style>