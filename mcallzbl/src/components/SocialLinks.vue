<template>
  <div class="social-links">
    <a
      v-for="link in socialLinks"
      :key="link.name"
      :href="link.url"
      :target="link.target || '_blank'"
      :class="`${link.name.toLowerCase()}-link`"
      :aria-label="link.ariaLabel || link.name"
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
      icon: new URL('@/assets/github-mark/github-mark-white.png', import.meta.url).href,
      ariaLabel: 'Visit my GitHub profile'
    },
    {
      name: 'Bilibili',
      url: 'https://space.bilibili.com/344689835',
      icon: new URL('@/assets/bilibili-white.svg', import.meta.url).href,
      ariaLabel: 'Visit my Bilibili space'
    }
  ]
})

const socialLinks = props.links
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
.bilibili-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.github-link:hover,
.bilibili-link:hover {
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

.github-link:hover .github-logo,
.bilibili-link:hover .bilibili-logo {
  opacity: 1;
  transform: scale(1.05);
}
</style>
