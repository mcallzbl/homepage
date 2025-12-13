# mcallzbl — Personal Homepage App

[English](./README.md) | [中文](./README.zh-CN.md)

Overview
- Static personal homepage built with Vue 3 + Vite + TypeScript.
- Multi-language with RTL support; responsive UI; accessible labels.
- Live site: https://mcallzbl.com

Features
- Multi-language (zh‑CN/zh‑TW/en/ja/ko/ru/fr/es/pt/ar/hi/de) via Vue I18n
- RTL support (Arabic) with mirrored layout where needed
- Dynamic backgrounds (`DynamicBackground.vue`) with randomized effects
- Hero section with typewriter effect and social links
- Portfolio projects with i18n descriptions and linkified URLs
- Fixed GitHub corner link component with SVG icon and RTL-aware positioning
- Basic SEO hooks (`usePageSEO`)

Structure (selected)
- `src/App.vue` — root layout; mounts Hero + Portfolio; adds GitHub corner
- `src/views/PortfolioView.vue` — project list wired to i18n
- `src/components/ProjectCard.vue` — tags, highlights, safe linkify rendering
- `src/components/HeroSection.vue` — greeting, name, quote typewriter, `SocialLinks`
- `src/components/SocialLinks.vue` — GitHub/Bilibili icons with localized aria labels
- `src/components/LanguageSelector.vue` — sorted list, URL `?lang=` sync, RTL-aware
- `src/components/GithubCorner.vue` — fixed repo link, SVG, RTL + light mode tweaks
- `src/components/DynamicBackground.vue` — animated background effects
- `src/i18n/index.ts` — initial locale detection (URL → browser → zh fallback)
- `src/i18n/locales/*.json` — translations (includes `social.*` and `portfolio.*`)
- `src/config/languages.ts` — supported languages + `isRTLLanguage`
- `src/composables/useTypewriter.ts`, `usePageSEO.ts`

Internationalization & RTL
- Initial locale priority: URL `?lang=` > `navigator.language` > fallback `en`
- `zh` short code maps to `zh-CN`
- RTL languages defined in `src/config/languages.ts` (currently `ar`)

Add a Project (Portfolio)
1) Add i18n entries in every locale under `portfolio.projects.<key>`:
   - `description`, `highlights` (array-like: `0`,`1`,...)
2) Register the project in `src/views/PortfolioView.vue` with:
   - `name`, `description: t('...')`, optional `githubUrl`/`demoUrl`, `tags`, `highlights`

Add a Language
1) Create `src/i18n/locales/<lang>.json` with full key structure
2) Import it in `src/i18n/index.ts` and extend the `messages` map
3) Append the code to `SUPPORTED_LANGUAGES` and `LANGUAGE_NAMES` (and to `RTL_LANGUAGES` if RTL)
4) Verify `LanguageSelector` shows it and URL `?lang=` works

Development (pnpm)
```bash
pnpm install
pnpm dev
pnpm build
pnpm test:unit
pnpm lint
pnpm format
```

Build & Deploy
- Build once, serve statically
  ```bash
  pnpm build
  ```
- Deploy `dist/` to any static host (GitHub Pages, Vercel, Netlify, Nginx, ...)
