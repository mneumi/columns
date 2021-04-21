<template>
  <div class="column-wrapper">
    <div class="column-header">
      <div class="avatar">
        <img :src="picture" />
      </div>
      <div class="info">
        <div class="title">{{ title }}</div>
        <div class="desc">{{ desc }}</div>
      </div>
    </div>
    <div class="column-item" v-for="item in list" :key="item.postId">
      <div class="title" @click="() => enterPost(item.postId)">
        {{ item.title }}
      </div>
      <div class="main">
        <img :src="item.picture" />
        <div class="content">
          {{ item.content }}
        </div>
      </div>
      <div class="date">{{ parseTimestampToDate(item.updateAt) }}</div>
    </div>
    <div class="load-more">加载更多</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { parseTimestampToDate } from "@/utils";
import request from "@/request";

const useColumnInfo = () => {
  const route = useRoute();
  const id = route.params.id as string;

  const picture = ref<string>("");
  const title = ref<string>("");
  const desc = ref<string>("");

  request.get(`/columns/${id}`).then((result) => {
    const column = result.data.data.column;

    picture.value = column.picture;
    title.value = column.title;
    desc.value = column.desc;
  });

  return { picture, title, desc };
};

const usePostList = () => {
  const route = useRoute();
  const id = route.params.id as string;

  const list = ref([]);

  request
    .get(`/columns/${id}/posts?currentPage=1&pageSize=5`)
    .then((result) => (list.value = result.data.data.posts));

  return { list };
};

const useEnterPost = () => {
  const router = useRouter();

  const enterPost = (id: string) => {
    router.push(`/posts/${id}`);
  };

  return { enterPost };
};

export default defineComponent({
  name: "Column",
  setup() {
    const { picture, title, desc } = useColumnInfo();
    const { list } = usePostList();
    const { enterPost } = useEnterPost();

    return {
      picture,
      title,
      desc,
      list,
      enterPost,
      parseTimestampToDate,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.column-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1.3rem;
  .column-header {
    width: 8rem;
    height: 2.4rem;
    border-bottom: 0.01rem solid $middle-grey-color;
    display: flex;
    align-items: center;
    .avatar {
      width: 1.5rem;
      height: 1.5rem;
      margin: 0 0.2rem;
      img {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      .title {
        font-size: 0.26rem;
        margin-bottom: 0.2rem;
      }
      .desc {
        color: $light-grey-color;
      }
    }
  }
  .column-item {
    width: 7.8rem;
    height: 3rem;
    margin-top: 0.3rem;
    border-radius: 0.05rem;
    border: 0.01rem solid $light-black-color;
    box-sizing: border-box;
    padding: 0.2rem;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 0.28rem;
      &:hover {
        cursor: pointer;
      }
    }
    .main {
      flex: 1;
      display: flex;
      align-items: center;
      img {
        width: 2rem;
        border-radius: 0.05rem;
        margin-right: 0.3rem;
      }
      .content {
        font-size: 0.18rem;
        color: $light-grey-color;
        line-height: 0.3rem;
      }
    }
    .date {
      height: 0.3rem;
      line-height: 0.3rem;
      color: $light-grey-color;
    }
  }
  .load-more {
    width: 2rem;
    height: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $primary-color;
    border-radius: 0.05rem;
    border: 0.01rem solid $primary-color;
    margin-top: 0.3rem;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>