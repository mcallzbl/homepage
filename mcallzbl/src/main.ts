import './assets/main.css'

import App from './App.vue'
import { ViteSSG } from 'vite-ssg'
import { routes } from './router/routes'
import i18n, { getInitialLocale, loadLocaleMessages } from './i18n'
import { isSupportedLanguage, type SupportedLanguage } from './config/languages'

function getLanguageFromPath(path: string | undefined): SupportedLanguage {
  if (!path) return 'en'
  const cleanPath = path.split('?')[0]?.split('#')[0] ?? path
  const trimmed = cleanPath.replace(/^\/+|\/+$/g, '')
  const first = decodeURIComponent(trimmed.split('/')[0] || '')
  return isSupportedLanguage(first) ? first : 'en'
}

export const createApp = ViteSSG(
  App,
  { routes, base: '/' },
  async ({ app, router, isClient, routePath }) => {
    app.use(i18n)

    const initialLang = getLanguageFromPath(routePath || router.currentRoute.value.path)
    try {
      await loadLocaleMessages(initialLang)
    } catch {}

    router.beforeResolve(async (to, _from, next) => {
      // 兼容旧链接：/?lang=xx -> /xx
      const q = to.query?.lang
      const qLang = typeof q === 'string' ? q : undefined
      if (qLang && isSupportedLanguage(qLang)) {
        const target = qLang === 'en' ? '/' : `/${qLang}`
        if (to.path !== target) return next({ path: target, replace: true })
      }

      // 直接访问根路径时，按用户语言偏好自动跳转
      if (isClient && to.path === '/' && !qLang) {
        const preferred = getInitialLocale()
        if (preferred !== 'en') {
          return next({ path: `/${preferred}`, replace: true })
        }
      }

      const param = to.params.lang
      const lang =
        typeof param === 'string' && isSupportedLanguage(param)
          ? (param as SupportedLanguage)
          : getLanguageFromPath(to.path)
      try {
        await loadLocaleMessages(lang)
      } catch {}
      next()
    })

    if (isClient) {
      console.log('欢迎访问mcallzbl的个人主页！')
      console.log('仓库地址：https://github.com/mcallzbl/homepage')
      console.log('主页地址：https://mcallzbl.com')
    }
  },
)
