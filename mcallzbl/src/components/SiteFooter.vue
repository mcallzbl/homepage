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
  border-top: 1px solid var(--color-border);
  background: var(--color-background-mute);
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
  padding: 1rem 0;
  gap: 1rem;
}

.footer-left {
  color: var(--color-text);
  opacity: 0.8;
  font-size: 0.95rem;
}

.owner-link {
  color: var(--color-text);
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
  color: var(--color-text);
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
</style>
