import { createStore } from 'vuex';
import { IColumnInfo, IStore, IUser } from '@/interface';
import { request } from '@/request';

const getInitState = () => {
  let token = '';
  let user: IUser = {
    userId: '',
    email: '',
    nickname: '',
    desc: '',
    avatar: '',
    columnId: '',
  };
  let columnInfo: IColumnInfo = {
    columnId: '',
    title: '',
    desc: '',
    picture: '',
  };

  const storageToken = localStorage.getItem('token');
  if (storageToken) {
    token = storageToken;
  }

  const storageUser = localStorage.getItem('userInfo');
  if (storageUser) {
    user = JSON.parse(storageUser);
  }

  const storageColumnInfo = localStorage.getItem('columnInfo');
  if (storageColumnInfo) {
    columnInfo = JSON.parse(storageColumnInfo);
  }

  return { token, user, columnInfo };
};

const initState = getInitState();

const store = createStore<IStore>({
  state: {
    loading: 0,
    token: initState.token,
    user: initState.user,
    columnInfo: initState.columnInfo,
  },
  mutations: {
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
      localStorage.setItem('columnInfo', JSON.stringify(columnInfo));
    },
    logout(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('columnInfo');
      state.token = '';
    },
    addLoading(state) {
      state.loading++;
    },
    minusLoading(state) {
      state.loading--;
    },
  },
  actions: {
    async login(context, payload) {
      const { email, password } = payload;

      const result = await request.post('/auth/login', {
        email,
        password,
      });

      const token = result.data.token;

      context.commit('login', { token });

      await context.dispatch('getUserInfo');
      await context.dispatch('getColumnInfo');
    },
    async getUserInfo(context) {
      const result = await request.post('/users');
      context.commit('getUserInfo', result.data.user);
    },
    async getColumnInfo(context) {
      const result = await request.get(
        `/columns/${context.state.user.columnId}`
      );
      store.commit('getColumnInfo', result.data.column);
    },
  },
});

export default store;
