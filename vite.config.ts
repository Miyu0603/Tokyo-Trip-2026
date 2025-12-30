
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 必須與您的 GitHub 倉庫名稱完全一致
  // 例如：https://<username>.github.io/Tokyo-Trip-2026/
  base: '/Tokyo-Trip-2026/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
});
