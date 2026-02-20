<template>
  <section class="hero">
    <div class="text-content">
      <p class="greeting">{{ t('profile.greeting') }}</p>
      <h1 class="name">
        {{ t('profile.name') }}
        <span class="phonetic">{{ t('profile.phonetic') }}</span>
      </h1>
      <p class="quote">
        <span class="quote-mark">{{ t('punctuation.quoteStart') || '"' }}</span>
        <span class="typewriter-text">{{ displayedText }}</span>
        <span class="cursor" v-if="isTyping">|</span>
        <span class="quote-mark">{{ t('punctuation.quoteEnd') || '"' }}</span>
      </p>
      <SocialLinks />
    </div>
  </section>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTypewriter } from '@/composables/useTypewriter'
import SocialLinks from '@/components/SocialLinks.vue'

const { t, locale } = useI18n()

// 使用打字机效果
const { displayedText, isTyping, start } = useTypewriter({ speed: 50 })

// 启动打字机效果
const startTypewriter = () => {
  // 延迟启动打字机效果
  setTimeout(() => {
    start(t('profile.welcomeQuote'))
  }, 100)
}

// 监听语言变化，重新启动打字机
watch(locale, () => {
  setTimeout(() => {
    start(t('profile.welcomeQuote'))
  }, 100)
})

// 组件挂载时启动打字机
onMounted(() => {
  setTimeout(() => {
    startTypewriter()
  }, 1000)
})
</script>

<style scoped>
/* Hero Section - Compact */
.hero {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.text-content {
  max-width: 600px;
  text-align: center;
}

.greeting {
  font-size: 1.2rem;
  color: #a1a1aa;
  margin-bottom: 0.5rem;
}

.name {
  font-size: clamp(2.5rem, 7vw, 3.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #fafafa, #a1a1aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.phonetic {
  display: block;
  font-size: 1rem;
  font-weight: 400;
  color: #71717a;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.quote {
  font-size: 1.3rem;
  font-style: italic;
  color: #e4e4e7;
  margin: 1rem 0;
  line-height: 1.5;
  position: relative;
  display: inline-block;
}

.quote-mark {
  font-size: 1.6rem;
  color: #6366f1;
  font-weight: 600;
  font-style: normal;
}

.typewriter-text {
  display: inline;
}

.cursor {
  display: inline;
  color: #6366f1;
  font-weight: 600;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

/* Light mode support */
:deep(.app.light-mode) .cursor {
  color: #3b82f6;
}

:deep(.app.light-mode) .quote {
  color: #374151;
}

:deep(.app.light-mode) .quote-mark {
  color: #3b82f6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .name {
    font-size: clamp(1.5rem, 8vw, 2rem);
  }
}

@media (max-width: 480px) {
  .greeting {
    font-size: 1rem;
  }

  .quote {
    font-size: 1.1rem;
    margin: 0.8rem 0;
  }

  .quote-mark {
    font-size: 1.4rem;
  }
}
</style>
