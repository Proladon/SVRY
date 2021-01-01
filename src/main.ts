import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueFinalModal from 'vue-final-modal'
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

createApp(App)
    .use(store)
    .use(router)
    .use(VueFinalModal())
    .use(Toast, {position: POSITION.TOP_LEFT})
    .mount('#app')
