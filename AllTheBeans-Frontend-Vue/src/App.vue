<template>
  <div class="app-container">
    <h2>My Items</h2>
    
    <!-- Show the spinner if isLoading is true -->
    <LoadingSpinner v-if="isLoading" />
    
    <!-- Show the item list once loading is complete -->
    <ItemList v-else :items="myItems" />
    
    <!-- A button to trigger the reload for testing purposes -->
    <button @click="fetchItems" :disabled="isLoading" class="reload-btn">
      Reload Data
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import ItemList from './components/ItemList.vue';

const isLoading = ref(true);
const myItems = ref([]);

// Function to simulate fetching data from an API
const fetchItems = () => {
  isLoading.value = true;
  myItems.value =[];
  
  // Simulate network delay
  setTimeout(() => {
    myItems.value =[
      { id: 1, name: 'Vue.js', description: 'The Progressive JavaScript Framework' },
      { id: 2, name: 'Vite', description: 'Next Generation Frontend Tooling' },
      { id: 3, name: 'Pinia', description: 'The intuitive store for Vue' },
    ];
    isLoading.value = false;
  }, 2000);
};

// Fetch items when the component mounts
onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
.app-container {
  max-width: 500px;
  margin: 40px auto;
  font-family: sans-serif;
}

h2 {
  color: #333;
}

.reload-btn {
  margin-top: 20px;
  padding: 10px 16px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.reload-btn:disabled {
  background-color: #a7d8c2;
  cursor: not-allowed;
}
</style>