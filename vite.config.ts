/// <reference types="vitest/config" />
import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Sessions keep git worktrees under .claude/worktrees; never collect their tests.
  test: { exclude: [...configDefaults.exclude, "**/.claude/**"] },
});
