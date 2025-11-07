import consola from 'consola'
import { resolve } from 'node:path'

declare global {
  const consola: import('consola').ConsolaInstance
}
;(globalThis as any).consola = consola

// constants
export const ROOT_DIR = resolve(import.meta.dirname, '../../')
export const DIST_DIR = resolve(ROOT_DIR, 'dist')
