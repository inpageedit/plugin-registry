import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
  },
  resolve: {
    alias: {
      '~~': resolve(import.meta.dirname, '../../common'),
    },
  },
})
