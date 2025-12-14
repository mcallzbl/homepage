<template>
  <div class="social-links">
    <a
      v-for="link in socialLinks"
      :key="link.name"
      :href="link.url"
      :target="link.target || '_blank'"
      :class="`${link.name.toLowerCase()}-link`"
      :aria-label="link.ariaLabel || (link.name === 'GitHub' ? t('social.visitGithub') : link.name === 'Bilibili' ? t('social.visitBilibili') : link.name)"
    >
      <img
        :src="link.icon"
        :alt="link.name"
        :class="`${link.name.toLowerCase()}-logo`"
      />
    </a>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
export interface SocialLink {
  name: string
  url: string
  icon: string
  target?: string
  ariaLabel?: string
}

interface Props {
  links?: SocialLink[]
}

const props = withDefaults(defineProps<Props>(), {
  links: () => [
    {
      name: 'GitHub',
      url: 'https://github.com/mcallzbl',
      icon: new URL('@/assets/github-mark/github-mark-white.svg', import.meta.url).href,
      ariaLabel: ''
    },
    {
      name: 'Bilibili',
      url: 'https://space.bilibili.com/344689835',
      icon: new URL('@/assets/bilibili-white.svg', import.meta.url).href,
      ariaLabel: ''
    },
    {
      name: 'Email',
      url: 'mailto:contact@mail.mcallzbl.com',
      icon: new URL('@/assets/email.svg', import.meta.url).href,
      target: '_self',
      ariaLabel: ''
    }
  ]
})

const socialLinks = props.links
const { t } = useI18n()
</script>

<style scoped>
.social-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.github-link,
.bilibili-link,
.email-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.github-link:hover,
.bilibili-link:hover,
.email-link:hover {
  transform: translateY(-1px);
}

.github-logo {
  width: 24px;
  height: 24px;
  transition: all 0.2s ease;
  opacity: 0.8;
}

.bilibili-logo {
  width: 28px;
  height: 28px;
  transition: all 0.2s ease;
  opacity: 0.8;
}

.email-logo {
  width: 24px;
  height: 24px;
  transition: all 0.2s ease;
  opacity: 0.8;
}

.github-link:hover .github-logo,
.bilibili-link:hover .bilibili-logo,
.email-link:hover .email-logo {
  opacity: 1;
  transform: scale(1.05);
}

/* Light mode: invert white GitHub mark for visibility */
:deep(.app.light-mode) .github-logo {
  filter: invert(1);
}

/* Email icon is already white; no invert needed */
</style>
