<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLLanguage } from '@/config/languages'
import { usePageSEO } from '@/composables/usePageSEO'
import LanguageSelector from '@/components/LanguageSelector.vue'
import HeroSection from '@/components/HeroSection.vue'
import PortfolioView from '@/views/PortfolioView.vue'
import DynamicBackground from '@/components/DynamicBackground.vue'
import GithubCorner from '@/components/GithubCorner.vue'
import FriendLinks from '@/components/FriendLinks.vue'
import SiteFooter from '@/components/SiteFooter.vue'

const { locale } = useI18n()

// RTL 语言检测
const isRTL = computed(() => isRTLLanguage(locale.value as string))

// 页面可见性控制（用于初始动画）
const isVisible = ref(false)

// 动态背景效果类型：每次随机选择
const effects: Array<'particles' | 'formulas' | 'hello-world'> = ['particles', 'formulas', 'hello-world']
const randomEffect = effects[Math.floor(Math.random() * effects.length)] as 'particles' | 'formulas' | 'hello-world'
const backgroundEffect = ref<'particles' | 'code' | 'formulas' | 'hello-world'>(randomEffect)
// 延后挂载动态背景，避免阻塞首屏渲染
const showBackground = ref(false)

// 滚动到作品集
const portfolioSection = ref<HTMLElement | null>(null)

// 设置页面 SEO
usePageSEO()

// 初始化
onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  // 在空闲或下一帧之后再挂载背景特效（桌面端）；移动端或减少动态效果用户不启用
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  if (!(prefersReduced || isMobile)) {
    const enable = () => { showBackground.value = true }
    type RequestIdleCallbackFn = (cb: () => void, opts?: { timeout?: number }) => number
    const ric = (window as Window & { requestIdleCallback?: RequestIdleCallbackFn }).requestIdleCallback
    if (typeof ric === 'function') {
      ric(enable, { timeout: 1000 })
    } else {
      requestAnimationFrame(() => requestAnimationFrame(enable))
    }
  }
})

// Friend links configured at app level
interface FriendItem { title: string; url: string; description?: string }
const friendItems: FriendItem[] = [
  { title: 'Jimmy的小屋', url: 'https://blog.jimmypowell.dev', description: 'jimmy的小屋 欢迎做客' }
]
</script>

<template>
  <div class="app" :class="{ 'loaded': isVisible, 'rtl': isRTL }" :dir="isRTL ? 'rtl' : 'ltr'">
    <!-- Static Background Pattern -->
    <div class="bg-pattern"></div>

    <!-- Dynamic Background Effects (delayed mount) -->
    <DynamicBackground v-if="showBackground" :effect="backgroundEffect" color="#22c55e" :density="1" />

    <!-- Language Selector -->
    <LanguageSelector />

    <!-- Site GitHub Link -->
    <GithubCorner />

    <!-- Hero Section -->
    <div class="hero-container section">
      <div class="container">
        <div class="left-column">
          <HeroSection />

          <!-- Scroll Indicator -->
          <div
            class="scroll-indicator"
            @click="portfolioSection?.scrollIntoView({ behavior: 'smooth' })"
          >
            <span class="scroll-text">{{ $t('home.scrollDown') }}</span>
            <div class="scroll-arrow">↓</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Portfolio Section -->
    <section class="portfolio-section section" ref="portfolioSection">
      <div class="container">
        <PortfolioView />

        <!-- Friend Links Section -->
        <div class="friends-section">
          <h3 class="friends-title">{{ $t('friends.title') }}</h3>
          <FriendLinks :items="friendItems" />
        </div>
      </div>
    </section>
  </div>
  <SiteFooter />
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Fira Code', monospace;
  position: relative;
  overflow: hidden;
  background: transparent;
  color: #e4e4e7;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.hero-container {
  padding: 2rem 1.5rem;
}

.portfolio-section {
  padding: 4rem 2rem;
}

.friends-section {
  max-width: 1200px;
  margin: 3rem auto 0 auto;
}

.friends-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 1rem 0;
}

/* Scroll Indicator */
.scroll-indicator {
  margin-top: 4rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.scroll-indicator:hover {
  opacity: 1;
  transform: translateY(5px);
}

.scroll-text {
  font-size: 0.9rem;
  color: #e6edf3;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.scroll-arrow {
  font-size: 1.5rem;
  color: #22c55e;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Dark Mode (Hacker/GitHub style) */
.app:not(.light-mode) {
  color: #e6edf3;
}

.app:not(.light-mode) .bg-pattern {
  background-color: #0d1117;
  background-image:
    /* Terminal green matrix effect */
    radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.15) 1px, transparent 1px),
    /* Grid pattern */
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 24px,
      rgba(34, 197, 94, 0.03) 24px,
      rgba(34, 197, 94, 0.03) 25px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 24px,
      rgba(34, 197, 94, 0.03) 24px,
      rgba(34, 197, 94, 0.03) 25px
    );
  background-size: 50px 50px, 100% 100%, 100% 100%;
  animation: matrix-rain 20s linear infinite;
}

/* Light Mode (Clean minimalist) */
.app.light-mode {
  color: #1f2937;
}

.app.light-mode .bg-pattern {
  background-color: #f8fafc !important;
  background-image:
    /* Subtle dots */
    radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  animation: none !important;
}

.app.light-mode .scroll-text {
  color: #1f2937;
}

@keyframes matrix-rain {
  0% { background-position: 0 0, 0 0, 0 0; }
  100% { background-position: 50px 0, 0 0, 0 0; }
}

.app.loaded {
  opacity: 1;
  transform: translateY(0);
}

.bg-pattern {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  transition: all 0.5s ease;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

/* GitHub Corner Link */

/* RTL Support */
.app.rtl {
  direction: rtl;
}

.app.rtl .text-content {
  text-align: center;
}

.app.rtl .social-links {
  flex-direction: row-reverse;
}

/* Arabic Typography */
.app.rtl {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Fira Code', 'Noto Sans Arabic', sans-serif;
}

.app.rtl .greeting,
.app.rtl .name,
.app.rtl .quote {
  font-family: 'Noto Sans Arabic', 'Arial', sans-serif;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-container,
  .portfolio-section {
    padding: 2rem 1rem;
  }

  .scroll-indicator {
    margin-top: 2rem;
  }

  /* placeholder to keep block structure; styles moved to component */
}

/* 移动端禁用暗色模式下的背景动画，减少滚动帧丢失 */
@media (max-width: 768px) {
  .app:not(.light-mode) .bg-pattern {
    animation: none !important;
  }
}
</style>
