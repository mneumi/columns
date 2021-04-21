import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'normalize.css';
import './styles/base.scss';

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

VueMarkdownEditor.use(vuepressTheme);

createApp(App)
  .use(router)
  .use(store)
  .use(VueMarkdownEditor)
  .mount('#app');