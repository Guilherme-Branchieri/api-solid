import { defineConfig } from "vitest/dist/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    include: ["src/**/*.spec.ts"]
  },
});
