import {
  access,
  constants,
  cp,
  readdir,
  readFile,
  rmdir,
  writeFile,
} from 'node:fs/promises'
import { resolve } from 'node:path'
import consola from 'consola'

const SRC_DIR = resolve(import.meta.dirname, 'src')
const DST_DIR = resolve(import.meta.dirname, 'dist')
const INDEX_FILE = resolve(DST_DIR, 'index.json')
const FALLBACKS_FILE = resolve(SRC_DIR, 'fallbacks.json')

const index: {
  manifest_version: number
  languages: {
    code: string
    file: string
    fallback?: string
  }[]
} = {
  manifest_version: 1,
  languages: [],
}

consola.info('Removing existing dist directory...')
try {
  await rmdir(DST_DIR, { recursive: true })
} catch (_) {
  /* ignore */
}
consola.info('Copying languages to dist directory...')
await cp(resolve(SRC_DIR, 'languages'), DST_DIR, { recursive: true })

// Check if en.json exists
const enFile = resolve(DST_DIR, 'en.json')
try {
  await access(enFile, constants.F_OK)
} catch (_) {
  consola.error('en.json does not exist')
  process.exit(1)
}

consola.info('Reading languages...')
const languages = await readdir(DST_DIR, { withFileTypes: true }).then(
  (files) =>
    files
      .filter(
        (file) =>
          file.isFile() &&
          file.name.endsWith('.json') &&
          file.name !== 'index.json'
      )
      .map((file) => file.name.replace('.json', ''))
)

consola.info('Reading fallbacks...')
const fallbacks = (await readFile(FALLBACKS_FILE, 'utf-8').then(
  JSON.parse
)) as Record<string, string>

consola.info('Collecting all languages...')
// Collect all languages: files in dist + all keys/values from fallbacks
const existingLanguages = new Set<string>(languages)
const allLanguages = new Set<string>(languages)
Object.entries(fallbacks).forEach(([from, to]) => {
  allLanguages.add(from)
  allLanguages.add(to)
})

// Resolve multi-step fallback to the first language that has a file.
// If none in the chain exists, default to 'en'.
function resolveLanguage(finalCandidate: string): string {
  if (finalCandidate === 'en') return finalCandidate
  const visited = new Set<string>()
  let current = finalCandidate
  // Try following the chain until we hit an existing file or terminate
  while (true) {
    if (existingLanguages.has(current)) return current
    if (visited.has(current)) break
    visited.add(current)
    const next = fallbacks[current]
    if (!next) break
    current = next
  }
  // Default fallback
  return 'en'
}

// Build language entries array with optional missing/fallback metadata
index.languages = Array.from(allLanguages)
  .sort((a, b) => a.localeCompare(b))
  .map((language) => {
    const resolved = resolveLanguage(language)
    const hasOwnFile = existingLanguages.has(language)

    const entry: {
      code: string
      file: string
      missing?: boolean
      fallback?: string
    } = {
      code: language,
      file: `${resolved}.json`,
    }

    if (!hasOwnFile) entry.missing = true
    if (resolved !== language) entry.fallback = resolved

    return entry
  })
  .filter((entry) => entry.fallback !== 'en')

consola.info('Writing index file...')
await writeFile(INDEX_FILE, JSON.stringify(index, null, 2))

consola.success('Index file written successfully')
