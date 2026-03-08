import { defineConfig } from 'orval';

export default defineConfig({
    myApi: {
        input: {
            target: 'http://localhost:5089/swagger/v1/swagger.json', // URL to .NET swagger file
        },
        output: {
            mode: 'tags-split', // Splits controllers into separate files
            target: 'src/types/endpoints', // Where the API calls will be generated
            schemas: 'src/types/models',   // Where the TS models/entities will go
            client: 'axios', // or 'fetch' or 'vue-query'
            clean: true, // Clean the output directory before generating new files
            mock: true, // Enable mock generation
        },
    },
});