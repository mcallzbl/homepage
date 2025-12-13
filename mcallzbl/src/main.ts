import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import VueScrollTo from 'vue-scrollto'

const app = createApp(App)

app.use(i18n)
app.use(VueScrollTo)

app.mount('#app')