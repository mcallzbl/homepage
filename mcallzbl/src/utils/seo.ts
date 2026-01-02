export interface SEOConfig {
  title: string
  description: string
  keywords: string
  author: string
  url: string
  image?: string
  type?: string
  locale?: string
  alternateLanguages?: Record<string, string>
}

export function useSEO(config: Partial<SEOConfig>) {
  const defaultConfig: SEOConfig = {
    title: 'mcallzbl - Software Engineer',
    description: 'Backend Software Engineer specializing in modern web technologies. Passionate about creating efficient and scalable solutions.',
    keywords: 'software engineer, backend developer, web development, programming, mcallzbl',
    author: 'mcallzbl',
    url: 'https://mcallzbl.com',
    image: '/logo.svg',
    type: 'website',
    locale: 'en-US'
  }

  const finalConfig = { ...defaultConfig, ...config }

  // 设置页面标题
  document.title = finalConfig.title

  // 更新或创建meta标签
  const updateMetaTag = (name: string, content: string, property?: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement ||
               document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement

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

  // Open Graph标签
  updateMetaTag('', finalConfig.title, 'og:title')
  updateMetaTag('', finalConfig.description, 'og:description')
  updateMetaTag('', finalConfig.image || '', 'og:image')
  updateMetaTag('', finalConfig.url, 'og:url')
  updateMetaTag('', finalConfig.type || 'website', 'og:type')
  updateMetaTag('', finalConfig.locale || 'en-US', 'og:locale')

  // Twitter Card标签
  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', finalConfig.title)
  updateMetaTag('twitter:description', finalConfig.description)
  updateMetaTag('twitter:image', finalConfig.image || '')

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
  existingAlternateLinks.forEach(link => link.remove())

  if (finalConfig.alternateLanguages) {
    Object.entries(finalConfig.alternateLanguages).forEach(([lang, href]) => {
      const link = document.createElement('link')
      link.setAttribute('rel', 'alternate')
      link.setAttribute('hreflang', lang)
      link.setAttribute('href', href)
      document.head.appendChild(link)
    })
  }

  // 添加结构化数据
  let structuredDataScript = document.querySelector('script[type="application/ld+json"]')
  if (!structuredDataScript) {
    structuredDataScript = document.createElement('script')
    structuredDataScript.setAttribute('type', 'application/ld+json')
    document.head.appendChild(structuredDataScript)
  }

  structuredDataScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'mcallzbl',
    alternateName: 'mcallzbl',
    jobTitle: 'Software Engineer',
    description: finalConfig.description,
    url: finalConfig.url,
    sameAs: [
      'https://github.com/mcallzbl',
      'https://space.bilibili.com/344689835'
    ],
    knowsAbout: [
      'Backend Development',
      'Web Development',
      'Software Engineering',
      'Programming',
      'Database Design',
      'API Development'
    ],
    languagesSpoken: [
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
      'German'
    ]
  })
}
