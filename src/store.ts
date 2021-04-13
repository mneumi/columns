import { PropType } from 'vue';
import { createStore } from 'vuex';
import request from './request';

interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}

interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}

export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}

export interface PostProps {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createAt: string;
  column: string;
}

export interface GlobalDataProps {
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}

const store = createStore<GlobalDataProps>({
  state: {
    loading: false,
    columns: [],
    posts: [],
    user: {
      isLogin: false,
    },
  },
  mutations: {
    login(state) {
      state.user = { ...state.user, isLogin: true, name: 'viking' };
    },
    createPost(state, newPost) {
      state.posts.push(newPost);
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list;
    },
    fetchColumn(state, rawData) {
      state.columns = [rawData.data];
    },
    fetchPosts(state, rawData) {
      state.columns = rawData.data.list;
    },
    setLoading(state, status) {
      state.loading = status;
    },
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find((c) => c._id === id);
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter((post) => post.column === cid);
    },
  },
  actions: {
    async fetchColumns(context) {
      context.commit('setLoading', true);
      const res = await request.get('/columns');
      context.commit('fetchColumns', res.data);
      context.commit('setLoading', false);
    },
    async fetchColumn({ commit }, cid) {
      const res = await request.get(`/columns/${cid}`);
      commit('fetchColumn', res.data);
    },
    async fetchPosts({ commit }, cid) {
      const res = await request.get(`/columns/${cid}/posts`);
      commit('fetchProps', res.data);
    },
  },
});

export default store;
