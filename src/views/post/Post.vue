<template>
  <div class="post-wrapper">
    <div class="header">
      <router-link to="/">首页</router-link> /
      <router-link :to="`/columns/${postInfo.columnId}`">专栏首页</router-link>
      /
      <span>{{ postInfo.title }}</span>
    </div>
    <div class="header-img-wrapper">
      <img :src="postInfo.picture" />
    </div>
    <div class="title">{{ postInfo.title }}</div>
    <div class="author">
      <img class="avatar" :src="userInfo.avatar" />
      <div class="info">
        <div class="author-name">{{ userInfo.nickname }}</div>
        <div class="author-desc">{{ userInfo.desc }}</div>
      </div>
      <div class="date">
        发表于：{{ parseTimestampToDate(postInfo.updateAt) }}
      </div>
    </div>
    <div class="content">
      <v-md-editor v-model="postInfo.content" mode="preview"></v-md-editor>
    </div>
    <div class="controller" v-if="isOwner">
      <div class="edit btn" @click="() => editPost(postInfo.postId)">
        编辑文章
      </div>
      <div class="delete btn" @click="deletePost">删除文章</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, Ref, toRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { request } from "@/request";
import { IPost, IStore, IUser } from "@/interface";
import { parseTimestampToDate } from "@/utils";
import { createModel } from "@/components/model/Model.vue";
import { createMessage } from "@/components/message/Message.vue";
import { createCenterMessage } from "@/components/message/CenterMessage.vue";

export default defineComponent({
  name: "Post",
  setup() {
    const { postInfo, changePostInfo } = usePostInfo();
    const { userInfo, changeUserInfo } = useUserInfo();
    const { isOwner } = useIsOwner(postInfo);
    const { editPost } = useEditPost();
    const { deletePost } = useDeletePost(
      toRef(postInfo, "columnId"),
      toRef(postInfo, "postId")
    );
    useRequestData(postInfo.postId, changePostInfo, changeUserInfo);

    return {
      postInfo,
      userInfo,
      isOwner,
      editPost,
      deletePost,
      parseTimestampToDate,
    };
  },
});

const usePostInfo = () => {
  const route = useRoute();

  const postInfo = reactive<IPost>({
    postId: route.params.postId as string,
    columnId: route.query.columnId as string,
    title: "",
    desc: "",
    content: "",
    picture: "",
    createAt: "",
    updateAt: "",
  });

  const changePostInfo = (currentPost: IPost) => {
    for (const key in currentPost) {
      postInfo[key] = currentPost[key];
    }
  };

  return { postInfo, changePostInfo };
};

const useUserInfo = () => {
  const userInfo = reactive<Partial<IUser>>({
    avatar: "",
    nickname: "",
    desc: "",
  });

  const changeUserInfo = (currentUser: IUser) => {
    for (const key in currentUser) {
      userInfo[key] = currentUser[key];
    }
  };

  return { userInfo, changeUserInfo };
};

const useIsOwner = (postInfo: IPost) => {
  const store = useStore<IStore>();

  const isOwner = computed(() => {
    return store.state.user.columnId === postInfo.columnId;
  });

  return { isOwner };
};

const useEditPost = () => {
  const router = useRouter();

  const editPost = (postId: string) => {
    router.push(`/write?postId=${postId}`);
  };

  return { editPost };
};

const useDeletePost = (columnId: Ref<string>, postId: Ref<string>) => {
  const router = useRouter();

  const deletePost = () => {
    createModel(
      "确认删除文章",
      "确定要删除文章吗？一旦删除将无法恢复！",
      "确认删除",
      "取消删除",
      () => {
        request
          .delete(`/posts/${postId.value}`)
          .then(() => {
            createMessage(
              "删除文章成功，2秒后跳转到专栏首页",
              "success",
              () => {
                router.push(`/columns/${columnId.value}`);
              }
            );
          })
          .catch((err) => {
            if (err.error === 2) {
              createCenterMessage(err.data.message);
            } else {
              createMessage(err.data.message, "error");
            }
          });
      }
    );
  };

  return { deletePost };
};

const useRequestData = (
  currentPostId: string,
  changePostInfo: (currentPost: IPost) => void,
  changeUserInfo: (currentUser: IUser) => void
) => {
  request
    .get(`/posts/${currentPostId}`)
    .then((result) => {
      const currentPost = result.data.post as IPost;
      changePostInfo(currentPost);

      const currentUser = result.data.user as IUser;
      changeUserInfo(currentUser);
    })
    .catch((err) => {
      createMessage(err.data.message, "error");
    });
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.post-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1rem;
  .header {
    margin: 0.3rem 0 0.5rem 0;
    width: 8rem;
    height: 0.5rem;
    background-color: $light-white-color;
    border-radius: 0.06rem;
    line-height: 0.5rem;
    padding-left: 0.2rem;
    box-sizing: border-box;
    color: $light-grey-color;
  }
  .header-img-wrapper {
    width: 8rem;
    height: 4rem;
    img {
      width: 8rem;
      height: 4rem;
      border-radius: 0.1rem;
      object-fit: cover;
    }
  }
  .title {
    width: 8rem;
    font-size: 0.3rem;
    margin: 0.3rem 0;
  }
  .author {
    width: 8rem;
    border-top: 0.01rem solid $middle-grey-color;
    border-bottom: 0.01rem solid $middle-grey-color;
    display: flex;
    align-items: center;
    padding: 0.25rem 0;
    .avatar {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      margin-right: 0.2rem;
    }
    .info {
      flex: 1;
      line-height: 0.24rem;
      .author-desc {
        color: $light-grey-color;
      }
    }
    .date {
      font-style: italic;
      color: $light-grey-color;
    }
  }
  .content {
    width: 8.5rem;
    padding: 0.1rem 0 0.5rem 0;
  }
  .controller {
    width: 8rem;
    align-items: center;
    display: flex;
    height: 0.5rem;
    line-height: 0.5rem;
    text-align: center;
    color: $white-color;
    .btn {
      padding: 0 0.2rem;
      border-radius: 0.05rem;
      &:hover {
        cursor: pointer;
      }
    }
    .edit {
      background-color: $success-color;
      margin-right: 0.2rem;
    }
    .delete {
      background-color: $error-color;
    }
  }
}
</style>