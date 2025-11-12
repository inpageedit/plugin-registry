import {
  access,
  constants,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import { resolve } from 'node:path'
import consola from 'consola'
import { readI18nJSON, resolveLanguageFallbacks } from './utils.ts'

const SRC_DIR = resolve(import.meta.dirname, '../src')
const DST_DIR = resolve(import.meta.dirname, '../dist')
const LANGUAGES_SRC_DIR = resolve(SRC_DIR, 'languages')
const BASE_LANGUAGE = 'en'
const BASE_SRC_FILE = resolve(LANGUAGES_SRC_DIR, `${BASE_LANGUAGE}.yaml`)
const FALLBACKS_FILE = resolve(SRC_DIR, 'fallbacks.json')
const INDEX_DST_FILE = resolve(DST_DIR, 'index.json')

const index: {
  manifest_version: number
  base_language: string
  last_modified: string
  languages: Record<
    string,
    {
      file: string
      fallback?: string
      data?: Record<string, string>
    }
  >
} = {
  manifest_version: 1,
  base_language: BASE_LANGUAGE,
  last_modified: new Date().toISOString(),
  languages: {},
}

console.info(`Reading base language file from ${BASE_SRC_FILE}...`)
const base = await readI18nJSON(BASE_SRC_FILE)

consola.info('Reading fallbacks...')
const fallbacks = (await readFile(FALLBACKS_FILE, 'utf-8').then(
  JSON.parse
)) as Record<string, string>

try {
  await rm(DST_DIR, { recursive: true })
  consola.info('Removed existing dist directory')
} catch (_) {
  /* noop */
}

consola.info('Creating dist directory...')
await mkdir(DST_DIR, { recursive: true })

consola.info('Reading languages...')
const languageFiles = await readdir(LANGUAGES_SRC_DIR, {
  withFileTypes: true,
})
  .then((files) =>
    files.filter(
      (file) => file.isFile() && file.name.match(/(\.json|\.yaml|\.yml)$/)
    )
  )
  .then((files) => files.map((file) => file.name))
const languages = languageFiles.map((file) =>
  file.replace(/\.json|\.yaml|\.yml$/, '')
)

consola.info('Collecting all languages...')
// Collect all languages: files in dist + all keys/values from fallbacks
const allLanguages = new Set<string>(languages)
Object.entries(fallbacks).forEach(([from, to]) => {
  allLanguages.add(from)
  allLanguages.add(to)
})

// Build language entries array with optional missing/fallback metadata
index.languages = Object.fromEntries(
  Array.from(allLanguages)
    .sort((a, b) => a.localeCompare(b))
    .map<[string, { file: string; fallback?: string }]>((language) => {
      const resolved = resolveLanguageFallbacks(language, fallbacks, languages)
      const meta: {
        file: string
        fallback?: string
        data?: Record<string, string>
      } = {
        file: `${resolved}.json`,
      }
      if (resolved !== language) meta.fallback = resolved
      if (language === BASE_LANGUAGE) meta.data = base
      return [language, meta]
    })
    .filter(([_, meta]) => meta.fallback !== 'en')
)

consola.info('Writing languages files...')
for (const file of languageFiles) {
  const code = file.replace(/\.json|\.yaml|\.yml$/, '')
  const srcFile = resolve(LANGUAGES_SRC_DIR, file)
  const dstFile = resolve(DST_DIR, `${code}.json`)
  const data = await readI18nJSON(srcFile)
  if (code !== BASE_LANGUAGE) {
    // Fill missing keys from base language
    Object.entries(base).forEach(([key, value]) => {
      if (!data[key]) {
        consola.warn(`${file} is missing key: "${key}"`)
        data[key] = value
      }
    })
  }
  await writeFile(dstFile, JSON.stringify(data, null, 2))
  consola.success(` ├ ${file}.json`)
}
consola.success('Languages files written successfully')

consola.info('Writing index file...')
await writeFile(INDEX_DST_FILE, JSON.stringify(index, null, 2))
consola.success('Index file written successfully')

// Check if en.json exists
try {
  await access(resolve(DST_DIR, 'en.json'), constants.F_OK)
} catch (_) {
  consola.error('en.json does not exist')
  process.exit(1)
}

consola.success('Build completed successfully.')
