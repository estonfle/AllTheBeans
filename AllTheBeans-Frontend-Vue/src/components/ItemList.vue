<template>
  <div class="item-list-container">
    <ul v-if="items.length > 0" class="item-list">
      <li v-for="item in items" :key="item.id" class="item">
        <span class="item-name">{{ item.name }}</span>
        <span class="item-description">{{ item.description }}</span>
      </li>
    </ul>
    
    <div v-else class="empty-state">
      No items found.
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Define the props this component accepts
defineProps({
  items: {
    type: Array,
    required: true,
    default: () =>[]
  }
});
</script>

<style scoped>
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

.empty-state {
  text-align: center;
  color: #64748b;
  padding: 20px;
}
</style>