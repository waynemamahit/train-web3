import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import vue from "@vitejs/plugin-vue";
import jsconfigPaths from "vite-jsconfig-paths";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: "happy-dom",
    setupFiles: "test/setup-file.js",
    include: [
      // Matches vitest tests in any subfolder of 'src' or into 'test/'
      // Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
      "src/**/*.vitest.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    testTimeout: 9999999,
    globals: true,
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: "src/quasar-variables.scss",
    }),
    jsconfigPaths(),
  ],
});
