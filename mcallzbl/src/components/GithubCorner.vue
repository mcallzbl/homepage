<template>
  <a
    class="github-corner"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="aria || t('portfolio.viewOnGithub')"
    :title="title || 'GitHub'"
    :style="cornerStyle"
  >
    <img :src="iconSrc" alt="GitHub" class="github-icon" :style="{ width: props.size + 'px', height: props.size + 'px' }" />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isRTLLanguage } from '@/config/languages'

interface Props {
  href?: string
  ariaLabel?: string
  title?: string
  icon?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  href: 'https://github.com/mcallzbl/homepage',
  ariaLabel: '',
  title: 'GitHub',
  icon: new URL('@/assets/github-mark/github-mark-white.svg', import.meta.url).href,
  size: 28
})

const { t, locale } = useI18n()

const iconSrc = computed(() => props.icon)
const aria = computed(() => props.ariaLabel)

// Positioning: mirror left/right based on RTL, while keeping responsive offset via CSS var
const cornerStyle = computed(() => {
  const rtl = isRTLLanguage(locale.value as string)
  const offset = 'var(--corner-offset)'
  return rtl
    ? { left: 'auto', right: offset }
    : { left: offset, right: 'auto' }
})
</script>

<style scoped>
.github-corner {
  position: fixed;
  top: 2rem;
  z-index: 1000;
  color: #e6edf3;
  opacity: 0.8;
  transition: transform 0.2s ease, opacity 0.2s ease;
  /* default offset; used by inline style via var() */
  --corner-offset: 2rem;
}

.github-corner:hover {
  opacity: 1;
  transform: translateY(-1px) scale(1.05);
}

.github-icon {
  width: 28px;
  height: 28px;
}

/* Light mode tweaks */
:global(.app.light-mode) .github-corner { color: #1f2937; }
:global(.app.light-mode) .github-icon { filter: invert(1); }

@media (max-width: 768px) {
  .github-corner {
    top: 1rem;
    /* update responsive offset variable instead of hard-coding left/right */
    --corner-offset: 1rem;
  }
}

/* Fallback positioning using document direction on the app root */
:global(.app[dir="rtl"]) .github-corner {
  left: auto;
  right: var(--corner-offset);
}
:global(.app:not([dir="rtl"])) .github-corner {
  left: var(--corner-offset);
  right: auto;
}
</style>
