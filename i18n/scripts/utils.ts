import { readFile } from 'node:fs/promises'
import { parse } from 'yaml'

export function toFlatRecord(
  data: Record<string, any>,
  prefix?: string
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(data)) {
    if (key === '__meta__') {
      result[key] = value
      continue
    }
    const nextKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nested = toFlatRecord(value as Record<string, any>, nextKey)
      for (const [nk, nv] of Object.entries(nested)) {
        result[nk] = String(nv)
      }
    } else {
      result[nextKey] = String(value)
    }
  }
  return result
}

export function objectSort(data: any) {
  if (typeof data !== 'object' || data === null) return data
  if (Array.isArray(data)) return data.map(objectSort)
  return Object.fromEntries(
    Object.entries(data).sort(([a], [b]) => a.localeCompare(b))
  )
}

export async function readI18nJSON(
  path: string
): Promise<Record<string, string>> {
  if (path.endsWith('.json')) {
    return readFile(path, 'utf-8')
      .then(JSON.parse)
      .then(toFlatRecord)
      .then(objectSort)
  } else if (path.endsWith('.yaml') || path.endsWith('.yml')) {
    return readFile(path, 'utf-8')
      .then((i) => parse(i, {}))
      .then(toFlatRecord)
      .then(objectSort)
  } else {
    throw new Error(`Unsupported file type: ${path}`)
  }
}

export function resolveLanguageFallbacks(
  language: string,
  fallbacks: Record<string, string>,
  existing: string[]
) {
  if (language === 'en') return language
  const visited = new Set<string>()
  let current = language
  // Try following the chain until we hit an existing file or terminate
  while (true) {
    if (existing.includes(current)) return current
    if (visited.has(current)) break
    visited.add(current)
    const next = fallbacks[current]
    if (!next) break
    current = next
  }
  // Default fallback
  return 'en'
}
