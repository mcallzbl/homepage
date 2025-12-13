<template>
  <div class="portfolio-section">
    <div class="portfolio-container">
      <h2 class="portfolio-title">{{ $t('portfolio.title') }}</h2>
      <p class="portfolio-subtitle">{{ $t('portfolio.subtitle') }}</p>

      <div class="projects-grid">
        <ProjectCard
          v-for="project in projects"
          :key="project.name"
          :project="project"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCard, { type Project } from '@/components/ProjectCard.vue'

const { t } = useI18n()

const projects = computed<Project[]>(() => [
  {
    name: 'SpringLite',
    description: t('portfolio.projects.springlite.description'),
    githubUrl: 'https://github.com/mcallzbl/springlite',
    tags: ['Java', 'Spring', 'IoC', 'AOP', 'Framework'],
    highlights: [
      t('portfolio.projects.springlite.highlights.0'),
      t('portfolio.projects.springlite.highlights.1'),
      t('portfolio.projects.springlite.highlights.2')
    ]
  },
  {
    name: 'common',
    description: t('portfolio.projects.common.description'),
    githubUrl: 'https://github.com/mcallzbl/common',
    tags: [
      'Java',
      'Spring Boot',
      'AutoConfiguration',
      'Exception Handling',
      'Response Wrapper',
      'User Module',
      'Aliyun OSS',
      'Starter (WIP)'
    ],
    highlights: [
      t('portfolio.projects.common.highlights.0'),
      t('portfolio.projects.common.highlights.1'),
      t('portfolio.projects.common.highlights.2'),
      t('portfolio.projects.common.highlights.3')
    ]
  },
  {
    name: 'apklist',
    description: t('portfolio.projects.apklist.description'),
    githubUrl: 'https://github.com/mcallzbl/apklist',
    tags: [
      'Android',
      'Kotlin',
      'Jetpack Compose',
      'Material 3',
      'MVVM',
      'Hilt',
      'Coroutines',
      'Flow',
      'Coil',
      'Export'
    ],
    highlights: [
      t('portfolio.projects.apklist.highlights.0'),
      t('portfolio.projects.apklist.highlights.1'),
      t('portfolio.projects.apklist.highlights.2')
    ]
  }
])
</script>

<style scoped>
.portfolio-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.portfolio-container {
  max-width: 1200px;
  width: 100%;
}

.portfolio-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-heading);
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--color-heading), #42b883);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.portfolio-subtitle {
  font-size: 1.25rem;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .portfolio-title {
    font-size: 2rem;
  }

  .portfolio-subtitle {
    font-size: 1rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
