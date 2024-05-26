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
        // https: {
        //     key: fs.readFileSync('/var/www/html/ssl/live/favorite-item.com/privkey.pem'),
        //     cert: fs.readFileSync('/var/www/html/ssl/live/favorite-item.com/fullchain.pem'),
        // },
        host: true,
        hmr: {
            host: 'localhost',
        },
        mimeTypes: {
            'application/javascript': ['mjs'],
        },
    },
    optimizeDeps:{
        esbuildOptions: {
          target: "es2022"
        }
    }
});