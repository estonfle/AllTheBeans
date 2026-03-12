<!-- src/components/GreetingFetcher.vue -->
<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import axiosClient from '../api/axios-client';

// Define the fetch function
const fetchGreeting = async (): Promise<string> => {
  const response = await axiosClient.get('/api/greeting');
  return response.data.message; // Assuming API returns { message: "..." }
};

// Setup Vue Query
const { data: greetingMessage, isFetching, refetch } = useQuery({
  queryKey: ['greeting'],
  queryFn: fetchGreeting,
  enabled: false, // Prevents fetching automatically when component mounts
});

// Button click handler
const onFetchClick = () => {
  refetch();
};
</script>

<template>
  <div class="greeting-container">
    <button @click="onFetchClick" :disabled="isFetching">
      {{ isFetching ? 'Fetching...' : 'Get Greeting' }}
    </button>

    <!-- The box only renders if greetingMessage has a value -->
    <div v-if="greetingMessage" class="message-box">
      {{ greetingMessage }}
    </div>
  </div>
</template>

<style scoped>
.greeting-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  /* margin: 20px; */
}

button {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 8px;
}

/* Styling for the box that appears when text exists */
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