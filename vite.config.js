import path from 'path';
import { defineConfig } from 'vite';
import glob from 'fast-glob';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/sass_dashboard/',

  plugins: [],
  css: {
    postcss: {
      plugins: [],
    },
  },
  build: {
    minify: false, // disable minification
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync(['./*.html', './pages/**/*.html'])
          .map(file => [
            path.relative(
              __dirname,
              file.slice(0, file.length - path.extname(file).length)
            ),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      // output unminified CSS file
      output: {
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
