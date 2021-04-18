<template>
  <div class="column-wrapper">
    <div class="column-header">
      <div class="avatar">
        <img :src="avatarUrl" />
      </div>
      <div class="info">
        <div class="title">{{ title }}</div>
        <div class="desc">{{ description }}</div>
      </div>
    </div>
    <div class="column-item" v-for="item in list" :key="item._id">
      <div class="title" @click="() => enterPost(item._id)">
        {{ item.title }}
      </div>
      <div class="main">
        <img :src="item.image.url" />
        <div class="content">
          {{ item.excerpt }}
        </div>
      </div>
      <div class="date">{{ item.createdAt }}</div>
    </div>
    <div class="load-more">加载更多</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import request from "@/request";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "Detail",
  setup() {
    const route = useRoute();

    const columnInfo = reactive({
      avatarUrl: "",
      title: "",
      description: "",
      list: [],
    });

    onMounted(async () => {
      const id = route.params.id;

      const result = await request.get(`/columns/${id}`);

      const {
        data: { data: data },
      } = result;

      console.log("???", data);

      columnInfo.avatarUrl = data?.avatar?.url ?? "";
      columnInfo.title = data.title;  
      columnInfo.description = data.description;

      const result2 = await request.get(
        `/columns/${id}/posts?currentPage=1&pageSize=5`
      );

      const {
        data: { list: list },
      } = result2.data;

      columnInfo.list = list;
    });

    const { avatarUrl, title, description, list } = toRefs(columnInfo);

    const router = useRouter();

    const enterPost = (id: string) => {
      router.push(`/posts/${id}`);
    };

    return {
      avatarUrl,
      title,
      description,
      list,
      enterPost,
    };
  },
});
</script>

<style lang="scss" scoped>
.column-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 3rem;
  .column-header {
    width: 8rem;
    height: 2.4rem;
    border-bottom: 0.01rem solid #dee2e6;
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
        color: #6c757d;
      }
    }
  }
  .column-item {
    width: 7.8rem;
    height: 3rem;
    margin-top: 0.3rem;
    border-radius: 0.05rem;
    border: 0.01rem solid rgba(0, 0, 0, 0.075);
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
        color: #6c757d;
        line-height: 0.3rem;
      }
    }
    .date {
      height: 0.3rem;
      line-height: 0.3rem;
      color: #6c757d;
    }
  }
  .load-more {
    width: 2rem;
    height: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #0d6efd;
    border-radius: 0.05rem;
    border: 0.01rem solid #0d6efd;
    margin-top: 0.3rem;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>