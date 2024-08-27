import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes'
import { toastContainers } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

createApp(App)
    .use(router)
    .component('ToastContainer', toastContainers)
    .mount('#app')
