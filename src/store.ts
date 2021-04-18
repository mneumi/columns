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
      _id: '',
      email: '',
      nickName: '',
      description: '',
      avatar: '',
      column: '',
    },
    columns: [],
    columnInfo: {
      title: '',
      description: '',
      avatar: '',
    },
  },
  mutations: {
    fetchColumns(state, payload) {
      const { columns } = payload;
      state.columns = columns;
    },
    login(state, payload) {
      const { token } = payload;
      state.token = token;
      localStorage.setItem('token', token);
    },
    getUserInfo(state, payload) {
      const { column, email, nickName, _id } = payload;

      const userInfo = {
        ...state.user,
        _id,
        column,
        nickName,
        email,
      };

      state.user = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
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

      const result = await request.post('/user/login', {
        email,
        password,
      });

      const token = result.data.data.token;

      context.commit('login', { token });

      await context.dispatch('getUserInfo');
    },
    async register(context, payload) {
      const { email, password, nickName } = payload;

      const result = await request.post('/users', {
        email,
        password,
        nickName,
      });

      console.log(result);
    },
    async getUserInfo(context, payload) {
      if (!context.state.token) {
        return;
      }

      const {
        data: { data: data },
      } = await request.get('/user/current');
      context.commit('getUserInfo', data);
      console.log('userInfo ', data);
    },
    async updateUserInfo(context, payload) {
      const result = await request.patch(
        `/user/${context.state.user._id}`,
        payload
      );
      console.log("store.ts: ", result);
    },
    async updateColumnInfo(context, payload) {
      const result = await request.patch(`/columns/${context.state.user.column}`, payload);
      console.log(result);
    }
  },
});

export default store;
