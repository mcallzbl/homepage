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
            :src="iconSrc[item.url]"
            :alt="item.title"
            width="24"
            height="24"
            loading="lazy"
            fetchpriority="low"
          />
        </div>
        <div class="friend-content">
          <span class="friend-title">{{ item.title }}</span>
          <span v-if="item.description" class="friend-desc">{{ item.description }}</span>
        </div>
      </a>
    </div>
  </div>
  <div v-else class="friend-links-empty">
    {{ $t('friends.empty') }}
  </div>
  
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue'

export interface FriendItem {
  title: string
  url: string
  description?: string
}

interface Props {
  items: FriendItem[]
}

const props = defineProps<Props>()

// Track current icon shown for each url
const iconSrc = reactive<Record<string, string>>({})

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

const letterPalette = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6']
const stringHash = (s: string) => Array.from(s).reduce((acc, c) => (acc + c.charCodeAt(0)) | 0, 0)

const getLetterDataUrl = (title: string, url: string) => {
  const first = (title?.trim?.() || getHost(url) || '?').charAt(0).toUpperCase()
  const color = letterPalette[Math.abs(stringHash(title + url)) % letterPalette.length]
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">\n  <defs><style>.t{font:700 28px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial;}</style></defs>\n  <rect width="64" height="64" rx="12" fill="${color}"/>\n  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="#ffffff" class="t">${first}</text>\n</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// Prefetch helpers: only replace src when real favicon successfully loads
const loadImage = (src: string) =>
  new Promise<boolean>(resolve => {
    const img = new Image()
    img.loading = 'eager'
    img.decoding = 'async'
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })

// 保证每个 URL 只尝试一次，避免重复 404
const attempted = new Set<string>()

const prefetchFavicon = async (item: FriendItem) => {
  const url = item.url
  if (attempted.has(url)) return
  attempted.add(url)
  const primary = getPrimaryFavicon(url)
  const ok = await loadImage(primary)
  if (ok) {
    iconSrc[url] = primary
  }
}

const initIcons = () => {
  const list = props.items || []
  for (const it of list) {
    // Set placeholder first-letter avatar immediately (if not already a real icon)
    if (!iconSrc[it.url] || iconSrc[it.url].startsWith('data:image/svg+xml')) {
      iconSrc[it.url] = getLetterDataUrl(it.title, it.url)
    }
    // Then prefetch real favicon and swap in when available
    prefetchFavicon(it)
  }
}

onMounted(initIcons)
watch(() => props.items, initIcons, { deep: true })
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

.friend-content {
  display: flex;
  flex-direction: column;
  min-width: 0; /* enable ellipsis */
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

.friend-desc {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: .75;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
