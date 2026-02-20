import { createI18n } from 'vue-i18n'
import { isSupportedLanguage, type SupportedLanguage } from '@/config/languages'

type LocaleMessages = Record<string, unknown>
export const LANGUAGE_STORAGE_KEY = 'homepage.preferred-language'

// 动态按需加载各语言包，减少首包体积
const LOCALE_LOADERS: Record<SupportedLanguage, () => Promise<{ default: LocaleMessages }>> = {
  'zh-CN': () => import('./locales/zh.json'),
  'zh-TW': () => import('./locales/tw.json'),
  en: () => import('./locales/en.json'),
  ja: () => import('./locales/ja.json'),
  ko: () => import('./locales/ko.json'),
  ru: () => import('./locales/ru.json'),
  fr: () => import('./locales/fr.json'),
  es: () => import('./locales/es.json'),
  pt: () => import('./locales/pt.json'),
  ar: () => import('./locales/ar.json'),
  hi: () => import('./locales/hi.json'),
  de: () => import('./locales/de.json'),
  eo: () => import('./locales/eo.json'),
}

const resolveSupportedLanguage = (raw: string | null | undefined): SupportedLanguage | null => {
  if (!raw) return null

  const value = raw.trim()
  if (!value) return null
  if (isSupportedLanguage(value)) return value

  const lower = value.toLowerCase()
  if (lower.startsWith('zh')) {
    return /(^|[-_])(tw|hk|mo|hant)($|[-_])/i.test(value) ? 'zh-TW' : 'zh-CN'
  }

  const base = lower.split(/[-_]/)[0] ?? ''
  return isSupportedLanguage(base) ? base : null
}

/**
 * 从 URL 参数或浏览器设置中获取初始语言
 */
export const getInitialLocale = (): SupportedLanguage => {
  // 1) 从路径读取: /, /zh-CN, /ja, ...
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '') // trim slashes
    if (path) {
      const firstSegment = path.split('/')[0]
      if (firstSegment) {
        try {
          const maybeLang = resolveSupportedLanguage(decodeURIComponent(firstSegment))
          if (maybeLang) return maybeLang
        } catch {}
      }
    }
  }

  // 2) URL 参数兜底（兼容旧链接）
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const langParam = resolveSupportedLanguage(urlParams.get('lang'))
    if (langParam) return langParam
  }

  // 3) 本地已保存偏好
  if (typeof window !== 'undefined') {
    try {
      const stored = resolveSupportedLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY))
      if (stored) return stored
    } catch {}
  }

  // 4) 浏览器语言
  const browserLang =
    typeof navigator !== 'undefined' ? resolveSupportedLanguage(navigator.language) : null
  if (browserLang) return browserLang

  return 'en'
}

export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: 'en', // 初始占位，将在加载后切换到真实语言
  fallbackLocale: 'en', // 回退语言
  messages: {},
  warnHtmlMessage: false, // 关闭 HTML 内容警告（本项目文案包含 <-> 文本）
  globalInjection: true, // 全局注入 $t 函数
})

/**
 * 加载并设置语言包（按需加载）
 */
export async function loadLocaleMessages(locale: SupportedLanguage) {
  // 确保回退语言已加载
  if (!i18n.global.availableLocales.includes('en')) {
    const { default: enMsgs } = await LOCALE_LOADERS['en']()
    i18n.global.setLocaleMessage('en', enMsgs as LocaleMessages)
  }

  if (!i18n.global.availableLocales.includes(locale)) {
    const { default: msgs } = await LOCALE_LOADERS[locale]()
    i18n.global.setLocaleMessage(locale, msgs as LocaleMessages)
  }
  i18n.global.locale.value = locale
}

export default i18n
