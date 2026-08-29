import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from "@vitejs/plugin-react";
import tsconfigPaths from 'vite-tsconfig-paths';
import path from "node:path";
import { createRequire } from "node:module";
import { normalizePath } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const require = createRequire(import.meta.url);
const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));
const cMapsDir = normalizePath(path.join(pdfjsDistPath, "cmaps"));
const standardFontsDir = normalizePath(path.join(pdfjsDistPath, "standard_fonts"));

export default defineConfig({
    build: {
        target: "es2022",
        manifest: 'manifest.json',
    },
    esbuild: {
        target: "es2022"
    },
    plugins: [
        laravel({
            input: "resources/ts/main.tsx",
            refresh: true,
        }),
        react(),
        tsconfigPaths(),
        viteStaticCopy({
            targets: [
                {
                    src: `${cMapsDir}/*`,
                    dest: "cmaps",
                    rename: {
                        stripBase: true,
                    }
                },
                {
                    src: `${standardFontsDir}/*`,
                    dest: "standard_fonts",
                    rename: {
                        stripBase: true,
                    }
                },
            ],
        })
    ],
    server: {
        host: true,
        hmr: {
            host: '127.0.0.4',
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