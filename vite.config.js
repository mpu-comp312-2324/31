import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    assetsDir: '',
    sourcemap: true,
    minify: 'esbuild',
  },
  server: {
    port: 3000,
  },
});
