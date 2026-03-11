<script setup lang="ts">
// 1. Import the auto-generated Vue Query hook from Orval
// The path depends on your swagger tags and orval.config.ts setup
import { useGetAllBeans } from '@/types/endpoints/beans/beans'; 
import LoadingSpinner from './LoadingSpinner.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MessageSchema } from '../i18n/config'; 

const { t } = useI18n<{ message: MessageSchema }>();

// 2. Execute the hook! 
// This automatically triggers the Axios call, caches the result, 
// and provides reactive variables for your template.
const { 
  data, 
  isLoading, 
  isError, 
  error 
} = useGetAllBeans();

const items = computed(() => data.value?.items);
</script>

<template>
  <div class="item-list-container">
    <div v-if="isLoading" class="loading-state">
      <LoadingSpinner />
      <p>{{ t('loading') }}</p>
    </div>
    
    <div v-else-if="isError" class="error-state">
      {{ t('failedToLoad')}} {{ (error as Error).message }}
    </div>

    <ul v-else-if="items && items.length > 0" class="item-list">
      <li v-for="item in items" :key="item.id" class="item">
        <span class="item-name">{{ item.name }}</span>
        <span class="item-description">{{ item.description }}</span>
      </li>
    </ul>
    
    <div v-else class="empty-state">
      {{ t('notFound.') }}
    </div>
  </div>
</template>

<style scoped>
.item-list-container {
  min-height: 200px;
}
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}
.error-state {
  color: #ef4444;
  background-color: #fef2f2;
  border: 1px solid #f87171;
  border-radius: 8px;
}
.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}
.item-name {
  font-weight: bold;
  font-size: 1.1rem;
  color: #1e293b;
}
.item-description {
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 4px;
}
</style>