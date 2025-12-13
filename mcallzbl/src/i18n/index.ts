import { createI18n } from 'vue-i18n'
import { isSupportedLanguage, type SupportedLanguage } from '@/config/languages'

type LocaleMessages = Record<string, unknown>

// 动态按需加载各语言包，减少首包体积
const LOCALE_LOADERS: Record<SupportedLanguage, () => Promise<{ default: LocaleMessages }>> = {
  'zh-CN': () => import('./locales/zh.json'),
  'zh-TW': () => import('./locales/tw.json'),
  'en': () => import('./locales/en.json'),
  'ja': () => import('./locales/ja.json'),
  'ko': () => import('./locales/ko.json'),
  'ru': () => import('./locales/ru.json'),
  'fr': () => import('./locales/fr.json'),
  'es': () => import('./locales/es.json'),
  'pt': () => import('./locales/pt.json'),
  'ar': () => import('./locales/ar.json'),
  'hi': () => import('./locales/hi.json'),
  'de': () => import('./locales/de.json')
}

/**
 * 从 URL 参数或浏览器设置中获取初始语言
 */
export const getInitialLocale = (): SupportedLanguage => {
  // 1. 优先从 URL 参数中读取
  const urlParams = new URLSearchParams(window.location.search)
  const langParam = urlParams.get('lang')
  if (langParam && isSupportedLanguage(langParam)) {
    return langParam
  }

  // 2. 尝试从浏览器语言中获取
  const browserLang = navigator.language
  if (isSupportedLanguage(browserLang)) {
    return browserLang
  }

  // 3. 处理浏览器语言的简化版本（如 'zh' -> 'zh-CN'）
  const simplifiedLang = browserLang.split('-')[0]
  if (simplifiedLang === 'zh') {
    return 'zh-CN'
  }

  // 4. 默认返回英语
  return 'en'
}

export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: 'en', // 初始占位，将在加载后切换到真实语言
  fallbackLocale: 'en', // 回退语言
  messages: {},
  globalInjection: true // 全局注入 $t 函数
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
