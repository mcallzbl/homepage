<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-left">
        <span>
          © {{ yearText }}
          <a class="owner-link" :href="ownerUrl" target="_self">{{ owner }}</a>
        </span>
      </div>
      <div class="footer-right">
        <a
          class="footer-link"
          :href="licenseUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('footer.licensedUnder') }} {{ $t('footer.gplv3') }}
        </a>
        <span class="sep">·</span>
        <a
          class="footer-link"
          :href="repoUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('footer.sourceCode') }}
        </a>
      </div>
    </div>
  </footer>
  
</template>

<script setup lang="ts">
// 固定所有者与链接；如需自定义可在此修改
const owner = 'mcallzbl'
const repoUrl = 'https://github.com/mcallzbl/homepage'
const licenseUrl = 'https://www.gnu.org/licenses/gpl-3.0.html'
const ownerUrl = 'https://mcallzbl.com'

const START_YEAR = 2025
const currentYear = new Date().getFullYear()
const yearText = currentYear <= START_YEAR ? String(START_YEAR) : `${START_YEAR}–${currentYear}`
</script>

<style scoped>
.site-footer {
  position: relative;
  border-top: 1px solid rgba(34, 197, 94, 0.25);
  background: rgba(13, 17, 23, 0.85);
  backdrop-filter: blur(10px);
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.25);
  color: #e6edf3; /* 明亮字体颜色，避免过暗 */
}

.site-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #22c55e, #3b82f6);
  opacity: 0.8;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 0;
  gap: 1rem;
}

.footer-left {
  color: inherit;
  opacity: 0.8;
  font-size: 0.95rem;
}

.owner-link {
  color: inherit;
  text-decoration: none;
}

.owner-link:hover {
  color: #22c55e;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-link {
  color: inherit;
  text-decoration: none;
  opacity: 0.8;
}

.footer-link:hover {
  opacity: 1;
  color: #22c55e;
}

.sep { opacity: 0.4; }

@media (max-width: 640px) {
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Light mode adjustments */
:global(.app.light-mode) .site-footer {
  background: rgba(255, 255, 255, 0.92);
  border-top-color: rgba(0, 0, 0, 0.06);
  box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.08);
  color: #1f2937; /* 浅色模式下的深色字体 */
}

:global(.app.light-mode) .site-footer::before {
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  opacity: 0.6;
}
</style>
