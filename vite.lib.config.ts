import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Library build for @inai/thinking-state: ESM, React external, styles stay
// inside the components (each renders its own <style>), tokens.css is
// copied by scripts/build-lib.mjs. Output: lib/ (not the app's dist/).
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    outDir: "lib",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    target: "es2022",
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/lib/index.ts"),
        chat: resolve(import.meta.dirname, "src/lib/chat.ts"),
        studio: resolve(import.meta.dirname, "src/lib/studio.ts"),
        // one entry per component (2026-11-17): a page loads only what it mounts
        "app-shell": resolve(import.meta.dirname, "src/lib/entries/app-shell.ts"),
        "ask-window": resolve(import.meta.dirname, "src/lib/entries/ask-window.ts"),
        "build-wizard": resolve(import.meta.dirname, "src/lib/entries/build-wizard.ts"),
        "cash-river": resolve(import.meta.dirname, "src/lib/entries/cash-river.ts"),
        "ceo-daily": resolve(import.meta.dirname, "src/lib/entries/ceo-daily.ts"),
        "cited-answer": resolve(import.meta.dirname, "src/lib/entries/cited-answer.ts"),
        "content-pipeline": resolve(import.meta.dirname, "src/lib/entries/content-pipeline.ts"),
        "converge-net": resolve(import.meta.dirname, "src/lib/entries/converge-net.ts"),
        "finance-report": resolve(import.meta.dirname, "src/lib/entries/finance-report.ts"),
        "method-quiz": resolve(import.meta.dirname, "src/lib/entries/method-quiz.ts"),
        "role-dashboard": resolve(import.meta.dirname, "src/lib/entries/role-dashboard.ts"),
        "source-preview": resolve(import.meta.dirname, "src/lib/entries/source-preview.ts"),
        "thinking-state": resolve(import.meta.dirname, "src/lib/entries/thinking-state.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      // runtime deps stay external (package.json dependencies): consumers install them once
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^matter-js($|\/)/, /^motion($|\/)/],
      output: { chunkFileNames: "chunks/[name]-[hash].js" },
    },
  },
});
