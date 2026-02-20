<template>
  <div class="language-selector" :style="selectorStyle">
    <button class="lang-toggle" @click="toggleDropdown" @keydown.enter="toggleDropdown">
      <span class="lang-icon">🌐</span>
      <span>{{ getCurrentLanguageName() }}</span>
      <span class="dropdown-arrow" :class="{ 'dropdown-open': isOpen }">▼</span>
    </button>

    <!-- Language Dropdown List -->
    <div
      v-if="isOpen"
      class="language-dropdown"
      :class="{ 'dropdown-open': isOpen }"
      :style="dropdownStyle"
    >
      <div
        v-for="lang in sortedLanguages"
        :key="lang"
        @click.stop="selectLanguage(lang)"
        @keydown.enter="selectLanguage(lang)"
        class="language-option"
        :class="{ active: locale === lang }"
        :tabindex="isOpen ? 0 : -1"
      >
        <span>{{ languageNames[lang as keyof typeof languageNames] }}</span>
        <span v-if="locale === lang" class="check-mark">✓</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LANGUAGE_STORAGE_KEY, loadLocaleMessages } from '@/i18n'
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_NAMES,
  isRTLLanguage,
  isSupportedLanguage,
  type SupportedLanguage,
} from '@/config/languages'

// 定义Props
interface Props {
  languages?: readonly string[]
  languageNames?: Record<string, string>
  updateUrl?: boolean
  // 语言排序方式：native(按本地名称字母序)、code(按语言代码)、none(保持原顺序)
  sortBy?: 'native' | 'code' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  updateUrl: true,
  sortBy: 'native',
})

// 定义Emits
interface Emits {
  (e: 'language-changed', language: string): void
}

const emit = defineEmits<Emits>()

const { locale } = useI18n()

// 使用Props中的配置，如果没有则使用默认值
const languages = computed(() => props.languages || SUPPORTED_LANGUAGES)
const languageNames = computed(() => props.languageNames || LANGUAGE_NAMES)

// 公正排序：默认按各语言的本地显示名排序
const sortedLanguages = computed(() => {
  const list = [...languages.value]
  if (props.sortBy === 'none') return list
  if (props.sortBy === 'code') return list.sort((a, b) => String(a).localeCompare(String(b)))
  // native
  return list.sort((a, b) => {
    const names = languageNames.value as Record<string, string>
    const an = names[a] || String(a)
    const bn = names[b] || String(b)
    return an.localeCompare(bn, undefined, { sensitivity: 'base', numeric: true })
  })
})

// 状态管理
const isOpen = ref(false)

// 切换下拉菜单
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 关闭下拉菜单
const closeDropdown = () => {
  isOpen.value = false
}

// 选择语言
const selectLanguage = async (lang: string) => {
  if (lang !== locale.value) {
    let targetLang: SupportedLanguage = isSupportedLanguage(lang)
      ? (lang as SupportedLanguage)
      : 'en'

    // 按需加载并切换语言（先加载再切换，避免切换后缺少文案）
    try {
      await loadLocaleMessages(targetLang)
    } catch {
      // 加载失败时回退到英语
      await loadLocaleMessages('en')
      targetLang = 'en'
    }

    // 同步更新本地 locale 引用
    locale.value = targetLang

    // 记住用户语言偏好
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, targetLang)
    } catch {}

    // 使用路径导航：/ (en) 或 /<lang>
    if (props.updateUrl) {
      const base = window.location.origin
      const target = targetLang === 'en' ? '/' : `/${targetLang}`
      // 使用 replaceState 避免整页刷新，保持当前滚动
      if (window.history.replaceState) {
        window.history.replaceState({}, '', base + target)
      } else {
        window.location.href = target
      }
    }

    // 触发语言变更事件
    emit('language-changed', lang)
  }

  closeDropdown()
}

// 获取当前语言名称
const getCurrentLanguageName = () => {
  return languageNames.value[locale.value as keyof typeof languageNames.value] || 'Language'
}

// 动态计算RTL样式
const selectorStyle = computed(() => {
  const isRTL = isRTLLanguage(locale.value as string)
  return {
    right: isRTL ? 'auto' : '2rem',
    left: isRTL ? '2rem' : 'auto',
  }
})

const dropdownStyle = computed(() => {
  const isRTL = isRTLLanguage(locale.value as string)
  return {
    right: isRTL ? 'auto' : '0',
    left: isRTL ? '0' : 'auto',
  }
})

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.language-selector')) {
    closeDropdown()
  }
}

// 键盘事件处理
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.language-selector {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
}

.lang-toggle {
  background: rgba(13, 17, 23, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(48, 54, 61, 0.5);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #e6edf3;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: space-between;
}

.lang-toggle:hover {
  background: rgba(22, 27, 34, 0.9);
  border-color: rgba(34, 197, 94, 0.3);
  transform: translateY(-1px);
}

.lang-icon {
  font-size: 1rem;
  opacity: 0.8;
}

.dropdown-arrow {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.dropdown-arrow.dropdown-open {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(13, 17, 23, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(48, 54, 61, 0.5);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  min-width: 150px;
  max-height: 300px;
  overflow-y: auto;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  visibility: hidden;
}

.language-dropdown.dropdown-open {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
}

.language-option {
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  color: #e6edf3;
  border-bottom: 1px solid rgba(48, 54, 61, 0.2);
}

.language-option:last-child {
  border-bottom: none;
}

.language-option:hover {
  background: rgba(34, 197, 94, 0.1);
  color: #10b981;
}

.language-option.active {
  background: rgba(34, 197, 94, 0.2);
  color: #10b981;
}

.check-mark {
  font-size: 0.9rem;
  color: #10b981;
}

/* Light mode支持 */
:deep(.app.light-mode) .lang-toggle {
  background: rgba(255, 255, 255, 0.95);
  color: #1f2937;
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

:deep(.app.light-mode) .lang-toggle:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(255, 255, 255, 1);
}

:deep(.app.light-mode) .language-dropdown {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

:deep(.app.light-mode) .language-option {
  color: #1f2937;
  border-bottom-color: rgba(0, 0, 0, 0.05);
}

:deep(.app.light-mode) .language-option:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

:deep(.app.light-mode) .language-option.active {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .language-selector {
    top: 1rem;
    right: 1rem;
  }

  .lang-toggle {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    min-width: 100px;
  }

  .language-dropdown {
    min-width: 120px;
  }

  .language-option {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}

/* 滚动条样式 */
.language-dropdown::-webkit-scrollbar {
  width: 6px;
}

.language-dropdown::-webkit-scrollbar-track {
  background: transparent;
}

.language-dropdown::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.3);
  border-radius: 3px;
}

.language-dropdown::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 197, 94, 0.5);
}
</style>
