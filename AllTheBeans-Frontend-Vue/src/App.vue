<template>
  <div class="app-container">
    <header class="header">
      <h2>Beans Dashboard</h2>
      
      <!-- 
        We can globally invalidate the query cache to force 
        all components using 'getItems' to refetch in the background. 
      -->
      <button 
        @click="fetchItems" 
        :disabled="isRefreshing" 
        class="reload-btn"
      >
        {{ isRefreshing ? 'Refreshing...' : 'Refresh Data' }}
      </button>
    </header>
    
    <!-- 
      The ItemList component is completely self-sufficient now. 
      It fetches and manages its own server state!
    -->
    <ItemList style="margin: 40px 0 40px 0;"/>
    <hr style="border: 1px solid red; height: 2px; background-color: red; width: 100%;">   
    <ItemList style="margin: 40px 0 40px 0;"/>
    <hr style="border: 1px solid red; height: 2px; background-color: red; width: 100%;"> 
    <ItemList style="margin: 40px 0 40px 0;"/>
    <hr style="border: 1px solid red; height: 2px; background-color: red; width: 100%;"> 
    <ItemList  style="margin: 40px 0 40px 0;"/> <!-- Multiple instances will share the same cache and update together! -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import ItemList from './components/ItemList.vue';
import { getGetAllBeansQueryKey } from '@/types/endpoints/beans/beans'; // Orval also generates query key helpers!

const queryClient = useQueryClient();
const isRefreshing = ref(false);

const fetchItems = async () => {
  isRefreshing.value = true;
  
  // Enterprise Pattern: Invalidate the cache.
  // This tells TanStack Query "Hey, the data for 'items' is stale."
  // Any component currently displaying 'items' will automatically 
  // refetch in the background via Axios, without unmounting!
  await queryClient.invalidateQueries({
    queryKey: getGetAllBeansQueryKey() 
  });
  
  isRefreshing.value = false;
};
</script>

<style scoped>
.app-container {
  max-width: 600px;
  margin: 40px auto;
  font-family: sans-serif;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}
h2 {
  color: #0f172a;
  margin: 0;
}
.reload-btn {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}
.reload-btn:hover:not(:disabled) {
  background-color: #2563eb;
}
.reload-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}
</style>