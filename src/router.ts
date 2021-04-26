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
      name: 'write',
      path: '/write',
      component: () => import('./views/write/Write.vue'),
      meta: { requiredLogin: true },
    },
    {
      name: 'Column',
      path: '/columns/:columnId',
      component: () => import('./views/column/Column.vue'),
    },
    {
      name: 'Post',
      path: '/posts/:postId',
      component: () => import('./views/post/Post.vue'),
    },
    {
      name: 'Edit',
      path: '/edit',
      component: () => import('./views/edit/Edit.vue'),
      meta: { requiredLogin: true },
    },
  ],
  scrollBehavior(to, from, savedPoint) {
    if (savedPoint) {
      return savedPoint;
    }
    return {
      left: 0,
      top: 0,
    };
  },
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiredLogin && !store.state.token) {
    next({ name: 'Login' });
  } else if (to.meta.redirectAlreadyLogin && store.state.token) {
    next('/');
  } else {
    next();
  }
});

export default router;
