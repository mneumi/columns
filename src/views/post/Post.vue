<template>
  <div class="post-wrapper">
    <div class="header">
      <a href="/">首页</a> / <a :href="`/columns/${columnId}`">专栏首页</a> /
      <span>{{ title }}</span>
    </div>
    <div class="header-img-wrapper">
      <img :src="picture" />
    </div>
    <div class="title">{{ title }}</div>
    <div class="author">
      <img class="avatar" :src="avatar" />
      <div class="info">
        <div class="author-name">{{ nickname }}</div>
        <div class="author-desc">{{ userDesc }}</div>
      </div>
      <div class="date">发表于：{{ parseTimestampToDate(updateAt) }}</div>
    </div>
    <div class="content">
      <v-md-editor v-model="content" mode="preview"></v-md-editor>
    </div>
    <div class="controller" v-if="isOwner">
      <div class="edit btn" @click="() => editPost(postId)">编辑文章</div>
      <div class="delete btn" @click="deletePost">删除文章</div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed, defineComponent, reactive, toRefs } from "vue";
import request from "@/request";
import { IPost, IStore, IUser } from "@/interface";
import { parseTimestampToDate } from "@/utils";
import { createModel } from "@/components/model/Model.vue";
import { createMessage } from "@/components/message/Message.vue";

export default defineComponent({
  name: "Post",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore<IStore>();
    const currentPostId = route.params.id;

    const postInfo = reactive<IPost>({
      postId: "",
      columnId: "",
      title: "",
      desc: "",
      content: "",
      picture: "",
      createAt: "",
      updateAt: "",
    });

    const userInfo = reactive<Partial<IUser>>({
      avatar: "",
      nickname: "",
      desc: "",
    });

    request
      .get(`/posts/${currentPostId}`)
      .then((resp) => {
        const currentPost = resp.data.data.post as IPost;

        postInfo.postId = currentPost.postId;
        postInfo.columnId = currentPost.columnId;
        postInfo.title = currentPost.title;
        postInfo.desc = currentPost.desc;
        postInfo.content = currentPost.content;
        postInfo.picture = currentPost.picture;
        postInfo.createAt = currentPost.createAt;
        postInfo.updateAt = currentPost.updateAt;

        const currentUser = resp.data.data.user as IUser;

        userInfo.avatar = currentUser.avatar;
        userInfo.nickname = currentUser.nickname;
        userInfo.desc = currentUser.desc;
      })
      .catch((err) => {
        const errContent = err?.data?.message || "网络发生错误";
        store.commit("setMessage", { content: errContent, type: "error" });
      });

    const isOwner = computed(() => {
      return store.state.user.columnId === postInfo.columnId;
    });

    const {
      postId,
      columnId,
      title,
      desc,
      content,
      picture,
      createAt,
      updateAt,
    } = toRefs(postInfo);

    const { avatar, nickname, desc: userDesc } = toRefs(userInfo);

    const deletePost = () => {
      createModel(
        "确认删除文章",
        "确定要删除文章吗？一旦删除将无法恢复！",
        "确认删除",
        "取消",
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
              const errContent = err?.data?.message || "网络发生错误";
              store.commit("setMessage", {
                content: errContent,
                type: "error",
              });
            });
        }
      );
    };

    const editPost = (postId: string) => {
      router.push(`/write?postid=${postId}`);
    }

    return {
      postId,
      columnId,
      title,
      desc,
      content,
      picture,
      createAt,
      updateAt,
      parseTimestampToDate,
      isOwner,
      avatar,
      nickname,
      userDesc,
      deletePost,
      editPost
    };
  },
});
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
    background-color: #e9ecef;
    border-radius: 0.06rem;
    line-height: 0.5rem;
    padding-left: 0.2rem;
    box-sizing: border-box;
    color: $light-grey-color;
  }
  .header-img-wrapper {
    width: 8rem;
    height: 3rem;
    img {
      width: 8rem;
      height: 3rem;
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