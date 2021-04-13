import { createRouter, createWebHistory } from 'vue-router';
import store from './store';
import Home from './views/home/Home.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: Home,
    },
    {
      name: 'Login',
      path: '/login',
      component: () => import('./views/login/Login.vue'),
      meta: { redirectAlreadyLogin: true },
    },
    {
      name: 'Register',
      path: '/register',
      component: () => import('./views/register/Register.vue'),
    },
    {
      name: 'Create',
      path: '/create',
      component: () => import('./views/register/Register.vue'),
      meta: { requiredLogin: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    next({ name: 'Login' });
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next('/');
  } else {
    next();
  }
});

export default router;
