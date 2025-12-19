import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Tokyo-Trip-2026/', // 改成你的專案名稱，前後都要有斜線
  build: {
    outDir: 'dist',
  }
});
