export interface SEOConfig {
  title: string
  description: string
  keywords: string
  author: string
  url: string
  image?: string
  type?: string
  locale?: string
  siteName?: string
  pronunciation?: string
  alternateLanguages?: Record<string, string>
}

export function useSEO(config: Partial<SEOConfig>) {
  // SSR/SSG safety: skip when document is not available
  if (typeof document === 'undefined') return

  const defaultConfig: SEOConfig = {
    title: 'mcallzbl - Software Engineer',
    description:
      'mcallzbl (/məkˈɔːl.zɪbəl/) - Backend Software Engineer specializing in modern web technologies and scalable web solutions.',
    keywords:
      'mcallzbl, mcallzbl pronunciation, /məkˈɔːl.zɪbəl/, software engineer, backend developer, web development, programming',
    author: 'mcallzbl',
    url: 'https://mcallzbl.com',
    image: '/logo.svg',
    type: 'website',
    locale: 'en-US',
    siteName: 'mcallzbl',
    pronunciation: '/məkˈɔːl.zɪbəl/',
  }

  const finalConfig = { ...defaultConfig, ...config }

  // 设置页面标题
  document.title = finalConfig.title

  // 更新或创建meta标签
  const updateMetaTag = (name: string, content: string, property?: string) => {
    let meta: HTMLMetaElement | null = null
    if (property) {
      meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
    } else {
      meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
    }

    if (!meta) {
      meta = document.createElement('meta')
      if (property) {
        meta.setAttribute('property', property)
      } else {
        meta.setAttribute('name', name)
      }
      document.head.appendChild(meta)
    }

    if (content) {
      meta.setAttribute('content', content)
    }
  }

  // 基础meta标签
  updateMetaTag('description', finalConfig.description)
  updateMetaTag('keywords', finalConfig.keywords)
  updateMetaTag('author', finalConfig.author)
  updateMetaTag(
    'robots',
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  )
  updateMetaTag(
    'googlebot',
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  )
  updateMetaTag('format-detection', 'telephone=no')

  const ogLocale = (finalConfig.locale || 'en-US').replace('-', '_')

  // Open Graph标签
  updateMetaTag('', finalConfig.title, 'og:title')
  updateMetaTag('', finalConfig.description, 'og:description')
  updateMetaTag('', finalConfig.image || '', 'og:image')
  updateMetaTag('', `${finalConfig.siteName || 'mcallzbl'} logo`, 'og:image:alt')
  updateMetaTag('', finalConfig.url, 'og:url')
  updateMetaTag('', finalConfig.type || 'website', 'og:type')
  updateMetaTag('', ogLocale, 'og:locale')
  updateMetaTag('', finalConfig.siteName || 'mcallzbl', 'og:site_name')

  // Twitter Card标签
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', finalConfig.title)
  updateMetaTag('twitter:description', finalConfig.description)
  updateMetaTag('twitter:image', finalConfig.image || '')
  updateMetaTag('twitter:image:alt', `${finalConfig.siteName || 'mcallzbl'} logo`)

  // 更新html lang属性
  document.documentElement.lang = finalConfig.locale?.split('-')[0] || 'en'

  // 更新canonical链接
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', finalConfig.url)

  // 添加多语言链接
  const existingAlternateLinks = document.querySelectorAll('link[rel="alternate"][hreflang]')
  existingAlternateLinks.forEach((link) => link.remove())

  if (finalConfig.alternateLanguages) {
    const existingOgLocaleAlternates = document.querySelectorAll(
      'meta[property="og:locale:alternate"]',
    )
    existingOgLocaleAlternates.forEach((meta) => meta.remove())

    Object.entries(finalConfig.alternateLanguages).forEach(([lang, href]) => {
      const link = document.createElement('link')
      link.setAttribute('rel', 'alternate')
      link.setAttribute('hreflang', lang)
      link.setAttribute('href', href)
      document.head.appendChild(link)

      const localeMeta = document.createElement('meta')
      localeMeta.setAttribute('property', 'og:locale:alternate')
      localeMeta.setAttribute('content', lang.replace('-', '_'))
      document.head.appendChild(localeMeta)
    })

    const defaultHref =
      finalConfig.alternateLanguages.en || Object.values(finalConfig.alternateLanguages)[0]
    if (defaultHref) {
      const xDefault = document.createElement('link')
      xDefault.setAttribute('rel', 'alternate')
      xDefault.setAttribute('hreflang', 'x-default')
      xDefault.setAttribute('href', defaultHref)
      document.head.appendChild(xDefault)
    }
  }

  const detectSourceUrl = () => {
    try {
      return new URL(finalConfig.url)
    } catch {
      return new URL(defaultConfig.url)
    }
  }

  const sourceUrl = detectSourceUrl()
  const siteOrigin = `${sourceUrl.protocol}//${sourceUrl.host}`
  const imageUrl = (finalConfig.image || '').startsWith('http')
    ? finalConfig.image || ''
    : `${siteOrigin}${finalConfig.image || ''}`

  const pronunciation = finalConfig.pronunciation || '/məkˈɔːl.zɪbəl/'
  const pronunciationSummary = `Name pronunciation: mcallzbl ${pronunciation}.`

  // 添加结构化数据
  let structuredDataScript = document.querySelector('#seo-structured-data') as HTMLScriptElement
  if (!structuredDataScript) {
    structuredDataScript = document.createElement('script')
    structuredDataScript.id = 'seo-structured-data'
    structuredDataScript.setAttribute('type', 'application/ld+json')
    document.head.appendChild(structuredDataScript)
  }

  structuredDataScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteOrigin}#person`,
        name: 'mcallzbl',
        alternateName: [`mcallzbl ${pronunciation}`, 'mcallzbl'],
        jobTitle: 'Software Engineer',
        description: `${finalConfig.description} ${pronunciationSummary}`,
        url: siteOrigin,
        sameAs: ['https://github.com/mcallzbl', 'https://space.bilibili.com/344689835'],
        knowsAbout: [
          'Backend Development',
          'Web Development',
          'Software Engineering',
          'Programming',
          'Database Design',
          'API Development',
        ],
        knowsLanguage: [
          'Chinese',
          'English',
          'Japanese',
          'Korean',
          'Russian',
          'French',
          'Spanish',
          'Esperanto',
          'Portuguese',
          'Arabic',
          'Hindi',
          'German',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteOrigin}#website`,
        url: siteOrigin,
        name: finalConfig.siteName || 'mcallzbl',
        inLanguage: finalConfig.locale || 'en-US',
      },
      {
        '@type': 'ProfilePage',
        '@id': `${finalConfig.url}#profile`,
        url: finalConfig.url,
        name: finalConfig.title,
        description: `${finalConfig.description} ${pronunciationSummary}`,
        inLanguage: finalConfig.locale || 'en-US',
        isPartOf: { '@id': `${siteOrigin}#website` },
        about: { '@id': `${siteOrigin}#person` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl,
        },
      },
    ],
  })
}
