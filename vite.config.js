import path from "path";
import { defineConfig } from "vite";
import glob from "fast-glob";
import { fileURLToPath } from "url";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/sass_dashboard/",
  
  plugins: [
    ViteImageOptimizer({
      png: {
        quality: 86,
      },
      jpeg: {
        quality: 86,
      },
      jpg: {
        quality: 86,
      },
      webp: {
        quality: 86,
      },
      avif: {
        quality: 86,
      },
      // Включаємо генерацію WebP
      includePublic: true,
      ansiColors: true,
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
              },
            },
          },
        ],
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [
        // PurgeCSS буде запускатися тільки під час збірки
        ...(process.env.NODE_ENV === 'production' ? [
          (await import("@fullhuman/postcss-purgecss")).default({
            content: [
              "./**/*.html",
              "./src/**/*.js",
              "./src/**/*.ts",
              "./src/**/*.scss",
              "./src/**/*.sass"
            ],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
            safelist: {
              standard: [/^active/, /^show/, /^fade/, /^collapse/],
              deep: [/modal/, /dropdown/, /tooltip/],
              greedy: [/data-bs-/]
            }
          })
        ] : []),
      ],
    },
  },
  build: {
    minify: false, // disable minification
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync(["./*.html", "./pages/**/*.html"])
          .map((file) => [
            path.relative(
              __dirname,
              file.slice(0, file.length - path.extname(file).length)
            ),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      // output unminified CSS file
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
