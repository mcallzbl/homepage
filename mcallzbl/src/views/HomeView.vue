<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('home.title') }}</h1>
        <p class="hero-subtitle">{{ $t('home.subtitle') }}</p>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>{{ $t('home.features.fast.title') }}</h3>
            <p>{{ $t('home.features.fast.description') }}</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>{{ $t('home.features.modern.title') }}</h3>
            <p>{{ $t('home.features.modern.description') }}</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>{{ $t('home.features.beautiful.title') }}</h3>
            <p>{{ $t('home.features.beautiful.description') }}</p>
          </div>
        </div>
        
        <div class="cta-section">
          <router-link to="/about" class="cta-button">
            {{ $t('home.getStarted') }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.home {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.hero {
  max-width: 1200px;
  width: 100%;
  text-align: center;
}

.hero-content {
  animation: fadeInUp 0.8s ease-out;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--color-heading), #42b883);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--color-text);
  margin-bottom: 3rem;
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: var(--color-background-soft);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #42b883, #369870);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.feature-card:hover::before {
  transform: translateY(0);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.feature-card h3 {
  font-size: 1.25rem;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.feature-card p {
  color: var(--color-text);
  opacity: 0.8;
  line-height: 1.6;
}

.cta-section {
  margin-top: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #42b883, #369870);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(66, 184, 131, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 184, 131, 0.4);
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

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
}
</style>