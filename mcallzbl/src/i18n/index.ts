import { createI18n } from 'vue-i18n'
import { SUPPORTED_LANGUAGES, isSupportedLanguage, type SupportedLanguage } from '@/config/languages'
import zhCN from './locales/zh.json'
import zhTW from './locales/tw.json'
import en from './locales/en.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import ru from './locales/ru.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import pt from './locales/pt.json'
import ar from './locales/ar.json'
import hi from './locales/hi.json'
import de from './locales/de.json'

const messages = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en': en,
  'ja': ja,
  'ko': ko,
  'ru': ru,
  'fr': fr,
  'es': es,
  'pt': pt,
  'ar': ar,
  'hi': hi,
  'de': de
}

/**
 * 从 URL 参数或浏览器设置中获取初始语言
 */
const getInitialLocale = (): SupportedLanguage => {
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

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getInitialLocale(), // 从 URL 或浏览器获取初始语言
  fallbackLocale: 'en', // 回退语言
  messages,
  globalInjection: true // 全局注入 $t 函数
})

export default i18n