<template>
  <a
    class="github-corner"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="aria || t('portfolio.viewOnGithub')"
    :title="title || 'GitHub'"
  >
    <img :src="iconSrc" alt="GitHub" class="github-icon" :style="{ width: props.size + 'px', height: props.size + 'px' }" />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()

const iconSrc = computed(() => props.icon)
const aria = computed(() => props.ariaLabel)
</script>

<style scoped>
.github-corner {
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 1000;
  color: #e6edf3;
  opacity: 0.8;
  transition: transform 0.2s ease, opacity 0.2s ease;
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

/* RTL: mirror position to avoid LanguageSelector overlap */
:global(.app[dir="rtl"]) .github-corner,
:global(.app.rtl) .github-corner {
  left: auto;
  right: 2rem;
}

@media (max-width: 768px) {
  .github-corner { top: 1rem; left: 1rem; }
  :global(.app[dir="rtl"]) .github-corner,
  :global(.app.rtl) .github-corner { right: 1rem; left: auto; }
}
</style>
