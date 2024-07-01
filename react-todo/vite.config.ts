import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: 'electron/preload.ts',
      },
    }),
  ],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@utils': '/src/utils',
      'quill-image-resize-module-react': 'node_modules/quill-image-resize-module-react'
    }
  },
  build: {
    rollupOptions: {
      external: ['express', 'pg'] // Exclure express et pg du bundle
    }
  }
});
