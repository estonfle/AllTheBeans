import { defineConfig } from 'orval';

export default defineConfig({
    api: {
        input: {
            target: 'http://localhost:5089/swagger/v1/swagger.json', // URL to .NET swagger file
        },
        output: {
            mode: 'tags-split', // Splits controllers into separate files
            target: 'src/types/endpoints', // Where the Vue Query hooks will be generated
            schemas: 'src/types/models',   // Where the TS models/entities will go
            client: 'vue-query', // or 'fetch' or 'axios'
            httpClient: 'axios',
            clean: true, // Clean the output directory before generating new files
            mock: true, // Enable mock generation

            // Tell Orval to use the custom Axios instance
            override: {
                mutator: {
                    path: 'src/api/mutator.ts', // <--- Path to the mutator which wraps the axiosInstance 
                    name: 'customAxiosInstance', // <--- The exported function name  
                },
            },
        },
    },
});