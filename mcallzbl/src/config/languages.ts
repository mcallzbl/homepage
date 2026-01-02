/**
 * 统一的语言配置
 * 集中管理所有支持的语言及其显示名称
 */

export interface LanguageConfig {
  code: string
  name: string
  nativeName: string
  isRTL?: boolean
}

// 支持的语言列表 - 使用 ISO 639-1 标准语言代码
export const SUPPORTED_LANGUAGES = [
  'zh-CN',
  'zh-TW',
  'en',
  'ja',
  'ko',
  'ru',
  'fr',
  'es',
  'pt',
  'ar',
  'hi',
  'de',
  'eo'
] as const

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

// 语言显示名称映射
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en': 'English',
  'ja': '日本語',
  'ko': '한국어',
  'ru': 'Русский',
  'fr': 'Français',
  'es': 'Español',
  'pt': 'Português',
  'ar': 'العربية',
  'hi': 'हिन्दी',
  'de': 'Deutsch',
  'eo': 'Esperanto'
}

// RTL (从右到左) 语言列表
export const RTL_LANGUAGES: SupportedLanguage[] = ['ar']

// 语言到 locale 的映射（用于 SEO 等场景）
export const LANGUAGE_LOCALE_MAP: Record<SupportedLanguage, string> = {
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'en': 'en-US',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
  'ru': 'ru-RU',
  'fr': 'fr-FR',
  'es': 'es-ES',
  'pt': 'pt-PT',
  'ar': 'ar-SA',
  'hi': 'hi-IN',
  'de': 'de-DE',
  'eo': 'eo'
}

/**
 * 检查语言是否为 RTL
 */
export function isRTLLanguage(lang: string): boolean {
  return RTL_LANGUAGES.includes(lang as SupportedLanguage)
}

/**
 * 检查语言代码是否被支持
 */
export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
}

/**
 * 获取语言的 locale 字符串
 */
export function getLanguageLocale(lang: SupportedLanguage): string {
  return LANGUAGE_LOCALE_MAP[lang] || 'en-US'
}

/**
 * 获取语言的显示名称
 */
export function getLanguageName(lang: string): string {
  return LANGUAGE_NAMES[lang as SupportedLanguage] || 'Language'
}
