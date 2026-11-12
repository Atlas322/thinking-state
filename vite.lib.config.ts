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
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/],
      output: { chunkFileNames: "chunks/[name]-[hash].js" },
    },
  },
});
