import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.mjs',
      cssFileName: 'style',
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
      },
    },
  },
  resolve: {
    alias: {
      '~~': resolve(import.meta.dirname, '../../common'),
    },
  },
})
