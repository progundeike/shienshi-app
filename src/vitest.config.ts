import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],

    test: {
        environment: "jsdom",
        globals: false,

        setupFiles: ["./tests/frontend/setup.ts"],

        include: [
            "tests/frontend/**/*.test.ts",
            "tests/frontend/**/*.test.tsx",
        ],

        clearMocks: true,
        restoreMocks: true,

        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            reportsDirectory: "./coverage",
            include: ["resources/ts/**/*.{ts,tsx}"],
            exclude: ["resources/ts/**/*.d.ts", "resources/ts/main.tsx"],
        },
    },
});
