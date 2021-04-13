<template>
  <div class="header-wrapper">
    <div class="header">
      <div class="title" @click="handleTitleClick">
        mneumi 专栏（仅用于演示）
      </div>
      <div class="feature">
        <div class="non-login" v-if="!isLogin">
          <div class="login btn" @click="handleLoginClick">登录</div>
          <div class="register btn" @click="handleRegisterClick">注册</div>
        </div>
        <div class="status" v-else>
          <div class="title" @click.stop="changeShowDropdown">
            <span>你好，mneumi</span>
          </div>
          <div class="dropdown" v-show="showDropdown" ref="dropdownRef">
            <div class="dropdown-item">新建文章</div>
            <div class="dropdown-item">编辑资料</div>
            <div class="dropdown-item">退出登录</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { GlobalDataProps } from "@/store";
import { defineComponent, ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "Header",
  setup() {
    const router = useRouter();
    const store = useStore<GlobalDataProps>();
    const dropdownRef = ref<null | HTMLElement>(null);
    const showDropdown = ref<boolean>(false);

    const changeShowDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };

    const isLogin = computed(() => {
      return store.state.user.isLogin;
    });

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

    const handleTitleClick = () => {
      router.push("/");
    };

    const handleLoginClick = () => {
      router.push("/login");
    };

    const handleRegisterClick = () => {
      router.push("/register");
    };

    onMounted(() => {
      document.addEventListener("click", clickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", clickOutside);
    });

    return {
      showDropdown,
      changeShowDropdown,
      dropdownRef,
      handleTitleClick,
      handleLoginClick,
      handleRegisterClick,
      isLogin
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
          }
        }
      }
      .status {
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
            &:nth-child(2n) {
              color: #666;
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