import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSEO } from '@/utils/seo'
import { SUPPORTED_LANGUAGES, getLanguageLocale, type SupportedLanguage } from '@/config/languages'

export interface PageSEOConfig {
  baseUrl?: string
  title?: string
  description?: string
  keywords?: string
  author?: string
  image?: string
  type?: string
}

/**
 * 页面 SEO Composable
 * 自动处理多语言 SEO 设置，包括 hreflang 标签
 */
export function usePageSEO(config: PageSEOConfig = {}) {
  const { t, locale } = useI18n()

  const {
    baseUrl = 'https://mcallzbl.com',
    title,
    description,
    keywords,
    author = 'mcallzbl',
    image = '/logo.svg',
    type = 'website'
  } = config

  /**
   * 生成多语言 URL 映射
   */
  const generateAlternateUrls = (): Record<string, string> => {
    const urls: Record<string, string> = {}

    SUPPORTED_LANGUAGES.forEach((lang) => {
      if (lang === 'en') {
        urls[lang] = baseUrl
      } else {
        urls[lang] = `${baseUrl}?lang=${lang}`
      }
    })

    return urls
  }

  /**
   * 设置 SEO 信息
   */
  const setupSEO = () => {
    const alternateUrls = generateAlternateUrls()
    const currentLang = locale.value as SupportedLanguage

    useSEO({
      title: title || 'mcallzbl',
      description: description || t('profile.welcomeQuote'),
      keywords: keywords || `mcallzbl, ${t('profile.education')}, ${t('profile.focus')}, ${t('profile.backend')}, Software Engineer, Backend Developer`,
      author,
      url: alternateUrls[currentLang] || baseUrl,
      image,
      type,
      locale: getLanguageLocale(currentLang),
      alternateLanguages: alternateUrls
    })
  }

  // 监听语言切换，自动更新 SEO
  watch(locale, setupSEO, { immediate: true })

  return {
    setupSEO
  }
}
