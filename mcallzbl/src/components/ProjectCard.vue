<template>
  <div class="project-card">
    <div class="project-header">
      <h3 class="project-name">{{ project.name }}</h3>
      <div class="project-actions">
        <a
          v-if="project.githubUrl"
          :href="project.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
          :aria-label="$t('portfolio.viewOnGithub')"
          title="GitHub"
        >
          <svg class="github-icon" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
      </div>
    </div>

    <p class="project-description" v-html="linkify(project.description)"></p>

    <div class="project-tags">
      <span
        v-for="tag in project.tags"
        :key="tag"
        class="project-tag"
      >
        {{ tag }}
      </span>
    </div>

    <div class="project-highlights" v-if="project.highlights && project.highlights.length > 0">
      <h4 class="highlights-title">{{ $t('portfolio.highlights') }}</h4>
      <ul class="highlights-list">
        <li v-for="(highlight, index) in project.highlights" :key="index" v-html="linkify(highlight)"></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

export interface Project {
  name: string
  description: string
  githubUrl?: string
  demoUrl?: string
  tags: string[]
  highlights?: string[]
}

interface Props {
  project: Project
}

defineProps<Props>()

// 将文本中的 URL 自动转换为可点击链接，并对非 URL 文本做转义
const escapeHtml = (s: string) =>
  (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')

const linkify = (text: string) => {
  // 仅做链接化：匹配 URL 并转换为 <a>，不附加额外样式类
  const urlRe = /(https?:\/\/[^\s]+)/g
  const parts = (text || '').split(urlRe)
  const html = parts
    .map((part, idx) => {
      if (idx % 2 === 1) {
        const trailingRe = /[)\]\}'"»》）】、。，；：!?]+$/
        const cleaned = part.replace(/["<>]/g, '')
        const href = cleaned.replace(trailingRe, '')
        const suffix = cleaned.slice(href.length)
        const safeHref = escapeHtml(href)
        return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeHref}</a>${escapeHtml(suffix)}`
      }
      return escapeHtml(part)
    })
    .join('')
  return html
}
</script>

<style scoped>
.project-card {
  background: rgba(13, 17, 23, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(48, 54, 61, 0.5);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.project-card:hover::before {
  transform: translateY(0);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.project-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
  flex: 1;
}

.github-link {
  color: var(--color-text);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  opacity: 0.7;
}

.project-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.demo-link {
  color: var(--color-text);
  opacity: 0.7;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.demo-link:hover {
  color: #22c55e;
  opacity: 1;
  transform: translateY(-1px);
}

.external-icon {
  width: 22px;
  height: 22px;
}

.github-link:hover {
  color: #22c55e;
  opacity: 1;
  transform: scale(1.1);
}

.github-icon {
  width: 24px;
  height: 24px;
}

.project-description {
  color: var(--color-text);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.project-description a { text-decoration: underline; }

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.project-tag {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.project-highlights {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.highlights-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 0.75rem 0;
}

.highlights-list {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--color-text);
  opacity: 0.9;
}

.highlights-list li {
  line-height: 1.8;
  margin-bottom: 0.5rem;
}

.highlights-list li::marker {
  color: #22c55e;
}

.highlights-list a { text-decoration: underline; }

/* Light mode adjustments */
/* 还原链接基础样式，仅保留下划线，颜色跟随文本 */

/* 外链箭头符号 */
.project-description a.link-chip::after,
.highlights-list a.link-chip::after {
  content: '\u2197'; /* ↗ */
  font-size: 0.85em;
  opacity: 0.85;
}

/* RTL Support */
:global([dir="rtl"]) .project-header {
  flex-direction: row-reverse;
}

:global([dir="rtl"]) .project-tags {
  direction: rtl;
}

:global([dir="rtl"]) .highlights-list {
  padding-left: 0;
  padding-right: 1.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .project-card {
    padding: 1.5rem;
  }

  .project-name {
    font-size: 1.25rem;
  }

  .github-icon {
    width: 20px;
    height: 20px;
  }

  .project-tags {
    gap: 0.4rem;
  }

  .project-tag {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
  }
}
</style>
