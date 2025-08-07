import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from "@vitejs/plugin-react";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    build: {
        target: "es2022",
        manifest: 'manifest.json',
        rollupOptions: {
            input: 'resources/ts/App.tsx'
        }
    },
    esbuild: {
        target: "es2022"
    },
    plugins: [
        laravel('resources/ts/App.tsx'),
        react(),
        tsconfigPaths(),
    ],
    server: {
        host: true,
        hmr: {
            host: '127.0.0.4',
            // host: 'localhost',
        },
        mimeTypes: {
            'application/javascript': ['mjs'],
        },
        cors: true,
    },
    optimizeDeps:{
        esbuildOptions: {
          target: "es2022"
        }
    }
});