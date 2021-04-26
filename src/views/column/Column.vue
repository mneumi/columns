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
    <div
      class="column-item"
      v-for="item in list"
      :key="item.postId"
      @click="() => enterPost(item.postId)"
    >
      <div class="title">
        {{ item.title }}
      </div>
      <div class="main">
        <div class="img-wrapper">
          <img :src="item.picture" />
        </div>
        <div class="desc">
          {{ item.desc }}
        </div>
      </div>
      <div class="date">{{ parseTimestampToDate(item.updateAt) }}</div>
    </div>
    <div v-if="hasMore" @click="getMore">
      <More />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { parseTimestampToDate } from "@/utils";
import { request } from "@/request";
import { createMessage } from "@/components/message/Message.vue";
import More, { useMore } from "@/components/more/More.vue";

export default defineComponent({
  name: "Column",
  components: { More },
  setup() {
    const { picture, title, desc, columnId } = useColumnInfo();
    const { list, hasMore, getMore } = useMore(`/columns/${columnId}/posts`);
    const { enterPost } = useEnterPost(columnId);

    return {
      picture,
      title,
      desc,
      enterPost,
      parseTimestampToDate,
      list,
      hasMore,
      getMore,
    };
  },
});

const useColumnInfo = () => {
  const route = useRoute();
  const columnId = route.params.columnId as string;

  const picture = ref<string>("");
  const title = ref<string>("");
  const desc = ref<string>("");

  request
    .get(`/columns/${columnId}`)
    .then((result) => {
      const column = result.data.column;

      picture.value = column.picture;
      title.value = column.title;
      desc.value = column.desc;
    })
    .catch((err) => {
      createMessage(err.message, "error");
    });

  return { picture, title, desc, columnId };
};

const useEnterPost = (columnId: string) => {
  const router = useRouter();

  const enterPost = (postId: string) => {
    router.push({
      path: `/posts/${postId}`,
      query: { columnId },
    });
  };

  return { enterPost };
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";
@import "@/styles/mixins.scss";

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
    height: 2.1rem;
    margin-top: 0.3rem;
    border-radius: 0.08rem;
    border: 0.01rem solid $light-black-color;
    box-sizing: border-box;
    padding: 0.15rem;
    display: flex;
    flex-direction: column;
    &:hover {
      cursor: pointer;
    }
    .title {
      font-size: 0.22rem;
    }
    .main {
      display: flex;
      align-items: center;
      height: 1rem;
      margin: 0.13rem 0;
      .img-wrapper {
        width: 2rem;
        height: 1rem;
        margin-right: 0.2rem;
        border-radius: 0.05rem;
        img {
          width: 2rem;
          height: 1rem;
          object-fit: cover;
          border-radius: 0.05rem;
        }
      }
      .desc {
        height: 1.8rem;
        padding: 0.12rem;
        box-sizing: border-box;
        font-size: 0.18rem;
        color: $light-grey-color;
        line-height: 0.3rem;
        @include center;
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