<template>
  <div class="header-wrapper">
    <div class="header">
      <div class="title">mneumi 专栏（仅展示用）</div>
      <div class="feature">
        <div class="non-login" v-if="false">
          <div class="login btn">登录</div>
          <div class="register btn">注册</div>
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
  <div class="slogn-wrapper">
    <img src="http://zhihu.vikingship.xyz/img/callout.5b86dfc8.svg">
    <div class="slogn">随心写作，快乐表达</div>
    <div class="btn">开始写文章</div>
  </div>
  <div class="column-list-wrapper">
    <div class="column-list-header">发现精彩</div>
    <div class="column-list">
      <template v-for="item in 10" :key="item">
        <div class="column">
          <div class="avatar">
            <img
              src="http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f3e41a8b7d9c60b68cdd1ec.jpg?x-oss-process=image/resize,m_pad,h_50,w_50"
            />
          </div>
          <div class="title">CATTI和MTI考研考试资料与资讯</div>
          <div class="desc">Vue is a</div>
          <div class="btn">进入专栏</div>
        </div>
      </template>
    </div>
  </div>
  <div class="footer-wrapper">
    <div class="footer">
      <span>&copy; mneumi (mneumi.cn) 版权所有 | 此仅为展示使用，不涉及任何商业用途</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

export default defineComponent({
  name: "Home",
  setup() {
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
      showDropdown,
      changeShowDropdown,
      dropdownRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.header-wrapper {
  width: 100vw;
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
          // background-color: cadetblue;
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
          left: 0.1rem;
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
.slogn-wrapper {
  width: 100vw;
  padding-top: .7rem;
  height: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 3.08rem;
  }
  .slogn {
    font-size: .4rem;
  }
  .btn {
    width: 1.2rem;
    height: .5rem;
    background-color: #0d6efd;
    line-height: .5rem;
    text-align: center;
    border-radius: .04rem;
    color: #FFF;
    margin-top: .4rem;
  }
}
.column-list-wrapper {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  .column-list-header {
    width: 12rem;
    display: flex;
    justify-content: center;
    font-weight: 900;
    margin-top: .6rem;
    font-size: .22rem;
  }
  .column-list {
    width: 12rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-bottom: 0.3rem;
    .column {
      width: 3.7rem;
      height: 2.6rem;
      border-radius: 0.06rem;
      background-color: #fff;
      margin-left: 0.23rem;
      margin-top: 0.3rem;
      box-sizing: border-box;
      padding: 0.2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 0.01rem solid rgba(0, 0, 0, 0.125);
      position: relative;
      .avatar {
        img {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
        }
      }
      .title {
        margin: 0.16rem 0;
        font-size: 0.2rem;
      }
      .desc {
        color: #6c757d;
      }
      .btn {
        padding: 0.1rem;
        border-radius: 0.06rem;
        border: 0.01rem solid #0d6efd;
        color: #0d6efd;
        position: absolute;
        bottom: 0.2rem;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
.footer-wrapper {
  width: 100vw;
  height: .7rem;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  .footer {
    width: 12rem;
    height: .7rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>