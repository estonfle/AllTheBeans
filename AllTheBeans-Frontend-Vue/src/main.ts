import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import i18n from './i18n/config';

const app = createApp(App);

// Install TanStack Query globally
app.use(VueQueryPlugin);

// Install i18n globally
app.use(i18n);

app.mount('#app');