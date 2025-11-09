import { resolve } from 'node:path'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index.ts'],
  outDir: 'dist',
  alias: {
    '~~': resolve(import.meta.dirname, '../../common'),
  },
  clean: true,
})
