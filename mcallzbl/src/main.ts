import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import i18n, { getInitialLocale, loadLocaleMessages } from './i18n'
import VueScrollTo from 'vue-scrollto'

const app = createApp(App)

app.use(i18n)
app.use(VueScrollTo)

// 按需加载当前语言后再挂载，避免首屏白屏/闪烁
loadLocaleMessages(getInitialLocale())
  .catch(() => {})
  .finally(() => {
    app.mount('#app')
  })
console.log("欢迎访问mcallzbl的个人主页！")
console.log("仓库地址：https://github.com/mcallzbl/homepage")
console.log("主页地址：https://mcallzbl.com")
