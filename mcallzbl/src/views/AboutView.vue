<template>
  <div class="about">
    <h1>{{ $t('common.about') }}</h1>
    <p>{{ $t('messages.success') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
</style>