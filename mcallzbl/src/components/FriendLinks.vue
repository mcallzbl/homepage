<template>
  <div class="friend-links" v-if="items && items.length">
    <div
      v-for="item in items"
      :key="item.url"
      class="friend-card"
    >
      <a :href="item.url" target="_blank" rel="noopener noreferrer" :aria-label="item.title" class="friend-link">
        <div class="favicon-wrap">
          <img
            class="favicon"
            :src="iconSrc[item.url] || getPrimaryFavicon(item.url)"
            :alt="item.title"
            width="24"
            height="24"
            @error="onIconError(item)"
          />
        </div>
        <span class="friend-title">{{ item.title }}</span>
      </a>
    </div>
  </div>
  <div v-else class="friend-links-empty">
    {{ $t('friends.empty') }}
  </div>
  
</template>

<script setup lang="ts">
import { reactive } from 'vue'

export interface FriendItem {
  title: string
  url: string
}

interface Props {
  items: FriendItem[]
}

const props = defineProps<Props>()

// Track which icon URL each link is using; rotate on error
const iconSrc = reactive<Record<string, string>>({})
const iconTries = reactive<Record<string, number>>({})

const getHost = (url: string) => {
  try {
    return new URL(url).host
  } catch {
    return ''
  }
}

const getOrigin = (url: string) => {
  try {
    return new URL(url).origin
  } catch {
    return ''
  }
}

const getPrimaryFavicon = (url: string) => `${getOrigin(url)}/favicon.ico`
const getGoogleFavicon = (url: string) => `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(getHost(url))}`

const letterPalette = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6']
const stringHash = (s: string) => Array.from(s).reduce((acc, c) => (acc + c.charCodeAt(0)) | 0, 0)

const getLetterDataUrl = (title: string, url: string) => {
  const first = (title?.trim?.() || getHost(url) || '?').charAt(0).toUpperCase()
  const color = letterPalette[Math.abs(stringHash(title + url)) % letterPalette.length]
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">\n  <defs><style>.t{font:700 28px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial;}</style></defs>\n  <rect width="64" height="64" rx="12" fill="${color}"/>\n  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="#ffffff" class="t">${first}</text>\n</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const onIconError = (item: FriendItem) => {
  const url = item.url
  const tries = (iconTries[url] || 0) + 1
  iconTries[url] = tries
  if (tries === 1) {
    iconSrc[url] = getGoogleFavicon(url)
  } else {
    iconSrc[url] = getLetterDataUrl(item.title, url)
  }
}
</script>

<style scoped>
.friend-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.friend-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}

.friend-link {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .9rem 1rem;
  color: var(--color-text);
  text-decoration: none;
}

.friend-card:hover {
  transform: translateY(-3px);
  border-color: rgba(34, 197, 94, 0.35);
  box-shadow: 0 8px 20px rgba(0,0,0,.08);
}

.favicon-wrap {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
}

.favicon {
  width: 20px;
  height: 20px;
}

.friend-title {
  font-weight: 600;
  color: var(--color-heading);
}

.friend-links-empty {
  text-align: center;
  color: var(--color-text);
  opacity: .7;
}

@media (max-width: 768px) {
  .friend-links { grid-template-columns: 1fr; }
}
</style>
