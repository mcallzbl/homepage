# mcallzbl — 个人主页应用

[English](./README.md) | [中文](./README.zh-CN.md)

## 概览
- 使用 Vue 3 + Vite + TypeScript 构建的静态个人主页
- 多语言与 RTL 支持；响应式 UI；可访问性良好
- 在线地址：https://mcallzbl.com

## 特性
- 多语言（zh‑CN/zh‑TW/en/ja/ko/ru/fr/es/pt/ar/hi/de/eo），基于 Vue I18n
- RTL（阿拉伯语）支持，必要区域镜像布局
- 动态背景（`DynamicBackground.vue`）随机效果
- Hero 区域打字机效果与社交链接
- 作品集卡片支持 i18n 描述与链接识别
- 固定 GitHub 角标（SVG 图标，RTL/浅色模式适配）
- 基础 SEO 处理（`usePageSEO`）

## 结构（节选）
- `src/App.vue` — 根布局；Hero + Portfolio；GitHub 角标
- `src/views/PortfolioView.vue` — 项目清单（对接 i18n）
- `src/components/ProjectCard.vue` — 标签、亮点、linkify 安全渲染
- `src/components/HeroSection.vue` — 问候、名字、引用打字机、`SocialLinks`
- `src/components/SocialLinks.vue` — GitHub/Bilibili 图标，aria 文案本地化
- `src/components/LanguageSelector.vue` — 排序、URL `?lang=` 同步、RTL 适配
- `src/components/GithubCorner.vue` — 固定仓库链接、SVG、RTL + 浅色模式
- `src/components/DynamicBackground.vue` — 动态背景效果
- `src/i18n/index.ts` — 初始语言检测（URL → 浏览器 → zh 回退）
- `src/i18n/locales/*.json` — 翻译（含 `social.*`、`portfolio.*`）
- `src/config/languages.ts` — 支持语言、`isRTLLanguage`
- `src/composables/useTypewriter.ts`、`usePageSEO.ts`

## i18n 与 RTL
- 初始语言优先级：URL `?lang=` > `navigator.language` > 回退 `en`
- 简写 `zh` 映射 `zh-CN`
- RTL 语言在 `src/config/languages.ts` 中声明（当前 `ar`）

## 新增作品
1) 在各语言 `portfolio.projects.<key>` 下添加：`description`、`highlights`（数组式键 `0`,`1`...）
2) 在 `src/views/PortfolioView.vue` 注册项目：`name`、`description: t('...')`、可选 `githubUrl`/`demoUrl`、`tags`、`highlights`

## 新增语言
1) 新建 `src/i18n/locales/<lang>.json`，补全键
2) 在 `src/i18n/index.ts` 引入并加入 `messages`
3) 在 `src/config/languages.ts` 增加 `SUPPORTED_LANGUAGES` 与 `LANGUAGE_NAMES`（RTL 同时加入 `RTL_LANGUAGES`）
4) 确认 `LanguageSelector` 展示并支持 `?lang=`

## 开发（pnpm）
```bash
pnpm install
pnpm dev
pnpm build
pnpm test:unit
pnpm lint
pnpm format
```

## 构建与部署
- 一次构建，静态托管
  ```bash
  pnpm build
  ```
- 将 `dist/` 发布到任何静态托管平台（GitHub Pages、Vercel、Netlify、Nginx …）
