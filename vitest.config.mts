import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    pool: "threads",
    coverage: {
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage/vitest",
    },
    include: ["demos/**/__tests__/**/*.test.{ts,tsx}", "app/**/__tests__/**/*.test.{ts,tsx}"],
    alias: {
      "@": resolve(rootDir, "./"),
    },
  },
});
