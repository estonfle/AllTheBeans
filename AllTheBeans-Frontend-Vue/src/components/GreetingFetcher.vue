<script setup lang="ts">
import {useGreeting} from '@/types/endpoints/greeting/greeting'; 

const { 
  data, 
  isFetching,
  refetch
} = useGreeting({
  query: {
    enabled: false 
  }
});

const fetchGreeting = async () => {
  await refetch();
};
</script>

<template>
  <div class="greeting-container">
    <button @click="fetchGreeting" :disabled="isFetching">
      {{ isFetching ? 'Fetching...' : 'Get Greeting' }}
    </button>

    <div v-if="data" class="message-box">
      {{ data.message }}
    </div>
  </div>
</template>

<style scoped>
.greeting-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
}

button {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 8px;
}

.message-box {
  padding: 16px;
  border: 2px solid black; /* Vue Green */
  border-radius: 8px;
  background-color: white;
  color: black;
  font-weight: bold;
}

button:hover {
  background-color: lightgray;
}
</style>