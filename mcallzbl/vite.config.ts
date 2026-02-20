import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { SUPPORTED_LANGUAGES } from './src/config/languages'

const DEFAULT_SITE_ORIGIN = 'https://mcallzbl.com'

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/+$/, '')
}

function routeToUrl(origin: string, route: string): string {
  return route === '/' ? origin : `${origin}${route}`
}

function buildSitemapXml(origin: string): string {
  const lastmod = new Date().toISOString().slice(0, 10)
  const otherLangs = SUPPORTED_LANGUAGES.filter(lang => lang !== 'en')

  const alternates = [
    { hreflang: 'x-default', href: routeToUrl(origin, '/') },
    { hreflang: 'en', href: routeToUrl(origin, '/') },
    ...otherLangs.map(lang => ({ hreflang: lang, href: routeToUrl(origin, `/${lang}`) }))
  ]
    .map(link => `    <xhtml:link rel="alternate" hreflang="${link.hreflang}" href="${link.href}" />`)
    .join('\n')

  const languageUrls = otherLangs
    .map(lang => [
      '  <url>',
      `    <loc>${routeToUrl(origin, `/${lang}`)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.9</priority>',
      '  </url>'
    ].join('\n'))
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    '  <url>',
    `    <loc>${routeToUrl(origin, '/')}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    '    <priority>1.0</priority>',
    alternates,
    '  </url>',
    languageUrls,
    '</urlset>',
    ''
  ].join('\n')
}

async function generateSitemap(): Promise<void> {
  const siteOrigin = normalizeOrigin(process.env.HOMEPAGE_SITE_ORIGIN || DEFAULT_SITE_ORIGIN)
  const sitemapPath = resolve(process.cwd(), 'dist', 'sitemap.xml')
  const xml = buildSitemapXml(siteOrigin)
  await writeFile(sitemapPath, xml, 'utf8')
  console.log(`[sitemap] generated: ${sitemapPath}`)
}

// https://vite.dev/config/
const config = {
  plugins: [
    vue(),
    vueDevTools(),
  ],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    concurrency: 1,
    includedRoutes: () => {
      const langs = SUPPORTED_LANGUAGES
      const routes = ['/']
      langs.forEach(l => {
        if (l !== 'en') routes.push(`/${l}`)
      })
      return routes
    },
    onFinished: async () => {
      await generateSitemap()
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
}

export default defineConfig(config)
