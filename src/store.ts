import { createStore } from 'vuex';
import { IStore, MessageType } from '@/interface';
import request from '@/request';

const store = createStore<IStore>({
  state: {
    loading: 0,
    message: {
      type: 'default',
      content: '',
    },
    token: localStorage.getItem('token') || '',
    user: {
      userId: '',
      email: '',
      nickname: '',
      desc: '',
      avatar: '',
      columnId: '',
    },
    columnInfo: {
      title: '',
      desc: '',
      picture: '',
    },
  },
  mutations: {
    fetchColumns(state, payload) {
      const { columns } = payload;
    },
    login(state, payload) {
      const { token } = payload;
      state.token = token;
      localStorage.setItem('token', token);
    },
    getUserInfo(state, payload) {
      const { avatar, columnId, userId, email, desc, nickname } = payload;

      const userInfo = {
        ...state.user,
        userId,
        columnId,
        nickname,
        email,
        desc,
        avatar,
      };

      state.user = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    getColumnInfo(state, payload) {
      const { title, desc, picture } = payload;

      const columnInfo = {
        ...state.columnInfo,
        title,
        desc,
        picture,
      };

      state.columnInfo = columnInfo;
    },
    logout(state, payload) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      state.token = '';
    },
    addLoading(state, payload) {
      state.loading++;
    },
    minusLoading(state, payload) {
      state.loading--;
    },
    setMessage(state, payload: { type: MessageType; content: string }) {
      const { content, type } = payload;
      state.message.type = type;
      state.message.content = content;
    },
  },
  getters: {},
  actions: {
    async fetchColumns(context, payload) {
      const result = await request.get('/columns', {
        params: {
          currentPage: 1,
          pageSize: 6,
        },
      });
      const list = result.data.data.list;
      context.commit('fetchColumns', { columns: list });
    },
    async login(context, payload) {
      const { email, password } = payload;

      const result = await request.post('/auth/login', {
        email,
        password,
      });

      const token = result.data.data.token;

      context.commit('login', { token });

      await context.dispatch('getUserInfo');
    },
    async register(context, payload) {
      const { email, password, nickname } = payload;

      await request.post('/auth/register', {
        email,
        password,
        nickname,
      });
    },
    async getUserInfo(context, payload) {
      const result = await request.post('/users');
      const { data } = result.data;
      context.commit('getUserInfo', data.user);
    },
    async updateUserInfo(context, payload) {
      const result = await request.put(
        `/users/${context.state.user.userId}`,
        payload
      );
      console.log('store.ts: ', result);
    },
    async getColumnInfo(context, payload) {
      const result = await request.get(
        `/columns/${context.state.user.columnId}`
      );

      const columnInfo = result.data.data.column;

      store.commit('getColumnInfo', columnInfo);
    },
    async updateColumnInfo(context, payload) {
      const result = await request.patch(
        `/columns/${context.state.user.columnId}`,
        payload
      );
      console.log(result);
    },
    async writePost(context, payload) {
      const result = await request.post('/posts', payload);
    },
  },
});

export default store;
