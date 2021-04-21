<template>
  <Slogn />
  <div class="column-list-wrapper">
    <div class="column-list-header">精选专栏</div>
    <div class="column-list">
      <template v-for="item in list" :key="item._id">
        <div class="column">
          <div class="avatar">
            <img :src="item.avatar.url" />
          </div>
          <div class="title">{{ item.title }}</div>
          <div class="desc">{{ item.description }}</div>
          <div class="btn" @click="() => enterColumn(item._id)">进入专栏</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { IStore } from "@/interface";
import Slogn from "./Slogn.vue";

export default defineComponent({
  name: "Home",
  components: { Slogn },
  setup() {
    const router = useRouter();
    const store = useStore<IStore>();

    onMounted(() => {
      store.dispatch("fetchColumns");
    });

    const enterColumn = (id: string) => {
      router.push(`/columns/${id}`);
    };

    const list = computed(() => store.state.columns);

    return { list, enterColumn };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.column-list-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 0.7rem;
  .column-list-header {
    width: 13rem;
    display: flex;
    justify-content: center;
    font-weight: 900;
    font-size: 0.22rem;
    margin: 0.3rem 0;
  }
  .column-list {
    width: 13rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .column {
      width: 4rem;
      height: 2.8rem;
      box-sizing: border-box;
      padding: 0.3rem 0.3rem;
      border-radius: 0.08rem;
      background-color: $white-color;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 0.01rem solid $light-black-color;
      position: relative;
      margin-bottom: 0.3rem;
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
        color: $light-grey-color;
      }
      .btn {
        padding: 0.1rem;
        border-radius: 0.06rem;
        border: 0.01rem solid $primary-color;
        color: $primary-color;
        position: absolute;
        bottom: 0.2rem;
        &:hover {
          background-color: $primary-color;
          color: $white-color;
          cursor: pointer;
        }
      }
    }
  }
}
</style>