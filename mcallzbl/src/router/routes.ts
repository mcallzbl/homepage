import type { RouteRecordRaw } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import { SUPPORTED_LANGUAGES } from '@/config/languages'

// Build a regex group for supported languages except 'en'
const otherLangs = SUPPORTED_LANGUAGES.filter((l) => l !== 'en')
// Escape dashes for the path regex
const escaped = otherLangs.map((l) => l.replace(/-/g, '\\-'))
const langPattern = escaped.join('|')

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage },
  // e.g. /zh-CN, /ja, /ar ...
  { path: `/:lang(${langPattern})`, name: 'home-lang', component: HomePage },
  // fallback
  { path: '/:pathMatch(.*)*', redirect: '/' },
]
