export interface CategoryRef {
  _id: number
  ns: string
  name: string
  sortkey: string
  start: number
  end: number
}

export interface CategoryRow {
  _id?: number | null
  name: string
  sortkey: string
  ns?: string | null
}

export interface DefaultSortMatch {
  start: number
  end: number
  value: string
}

export interface Parsed {
  categories: CategoryRef[]
  defaultSort: string
}

export function escapeRegExp(str: string): string {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Blank out comments, nowiki-like tags and templates (same length) so category
// links inside them are not treated as page categories (matches HotCat/VE)
const RAW_TAGS = ['nowiki', 'pre', 'code', 'math', 'syntaxhighlight', 'source', 'timeline', 'poem', 'hiero']
let _lastMaskedSource: string | null = null
let _lastMasked: string | null = null
function maskIgnoredRegions(text: string): string {
  // Single-entry memo: parse/build steps frequently mask the same text
  if (text === _lastMaskedSource) return _lastMasked!
  let masked = text.replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length))
  for (const tag of RAW_TAGS) {
    masked = masked.replace(
      new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?<\\/${tag}>`, 'gi'),
      (m) => ' '.repeat(m.length)
    )
  }
  // Templates (nested {{ ... }}), but keep the DEFAULTSORT magic word itself
  const chars = masked.split('')
  for (let i = 0; i < chars.length; i++) {
    if (!masked.startsWith('{{', i)) continue
    let k = i + 2
    while (k < masked.length && /\s/.test(masked[k])) k++
    const rest = masked.slice(k).toLowerCase()
    const isDefaultSort = rest.startsWith('defaultsort:') || rest.startsWith('defaultsortkey:')
    if (isDefaultSort) {
      // Skip past this magic word so its {{value}} stays intact
      let depth = 1
      let j = i + 2
      while (j < masked.length && depth > 0) {
        if (masked.startsWith('{{', j)) {
          depth++
          j += 2
        } else if (masked.startsWith('}}', j)) {
          depth--
          j += 2
        } else {
          j++
        }
      }
      if (depth === 0) i = j - 1
      continue
    }
    let depth = 1
    let j = i + 2
    while (j < masked.length && depth > 0) {
      if (masked.startsWith('{{', j)) {
        depth++
        j += 2
      } else if (masked.startsWith('}}', j)) {
        depth--
        j += 2
      } else {
        j++
      }
    }
    if (depth === 0) {
      for (let k2 = i; k2 < j; k2++) chars[k2] = ' '
      i = j - 1
    }
  }
  const maskedResult = chars.join('')
  _lastMaskedSource = text
  _lastMasked = maskedResult
  return maskedResult
}

let _catNsAlt: string | null = null

// Localized category namespace aliases (e.g. Category / 分类 / 分類)
export function getCategoryNamespaceAlt(): string {
  if (_catNsAlt) return _catNsAlt
  let nsIds: Record<string, number> = {}
  try {
    nsIds = (mw.config.get('wgNamespaceIds') as Record<string, number>) || {}
  } catch {
    /* ignore */
  }
  const canonicalId = Number(nsIds['category']) || 14
  const prefixes = new Set(['Category'])
  for (const [name, id] of Object.entries(nsIds)) {
    if (Number(id) === canonicalId && name) prefixes.add(name)
  }
  _catNsAlt = [...prefixes]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|')
  return _catNsAlt
}

// Canonical namespace name for new links (matches HotCat)
export function getCategoryNamespaceName(): string {
  try {
    const formatted = (mw.config.get('wgFormattedNamespaces') as Record<string, string>) || {}
    const nsId = Number((mw.config.get('wgNamespaceIds') as Record<string, number>)?.category) || 14
    const name = formatted[String(nsId)]
    if (typeof name === 'string' && name) return name
  } catch {
    /* ignore */
  }
  return 'Category'
}

export function stripCategoryPrefix(name: string): string {
  const alt = getCategoryNamespaceAlt()
  return String(name).replace(new RegExp(`^\\s*(?:${alt})\\s*:`, 'i'), '').trim()
}

export function findDefaultSortMatches(text: string): DefaultSortMatch[] {
  const matches: DefaultSortMatch[] = []
  const masked = maskIgnoredRegions(text)
  const re = /\{\{\s*(?:DEFAULTSORT|DEFAULTSORTKEY)\s*:\s*/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(masked))) {
    let i = re.lastIndex
    let depth = 1
    while (i < masked.length && depth > 0) {
      if (masked.startsWith('{{', i)) {
        depth++
        i += 2
      } else if (masked.startsWith('}}', i)) {
        depth--
        i += 2
      } else {
        i++
      }
    }
    if (depth !== 0) continue // skip unclosed
    const end = i - 2
    matches.push({ start: m.index, end, value: text.slice(re.lastIndex, end).trim() })
  }
  return matches
}

// Exclude display links such as [[:Category:...]] and ignored regions
// (comments / nowiki / templates)
export function parseCategories(wikitext: string): Parsed {
  const categories: CategoryRef[] = []
  const ds = findDefaultSortMatches(wikitext)
  const alt = getCategoryNamespaceAlt()
  const re = new RegExp(
    `\\[\\[\\s*(?<ns>${alt})\\s*:\\s*(?<name>[^\\[\\]|]*?)(?:\\s*\\|\\s*(?<sortkey>[^\\[\\]]*?))?\\s*\\]\\]`,
    'gi'
  )
  const masked = maskIgnoredRegions(wikitext)
  let m: RegExpExecArray | null
  let nextId = 1
  while ((m = re.exec(masked))) {
    categories.push({
      _id: nextId++,
      ns: m.groups!.ns.trim(),
      name: m.groups!.name.trim(),
      sortkey: (m.groups!.sortkey ?? '').trim(),
      start: m.index,
      end: m.index + m[0].length,
    })
  }
  return { categories, defaultSort: ds[0]?.value || '' }
}

export function stripDefaultSort(text: string): string {
  // Reuse findDefaultSortMatches so DEFAULTSORT inside comments/templates/nowiki
  // is ignored, consistent with parsing
  const matches = findDefaultSortMatches(text)
  let out = text
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i]
    let start = m.start
    let end = m.end + 2 // include the closing }}
    // A DEFAULTSORT leading a line also drops its indentation and trailing newline
    let lead = start
    while (lead > 0 && (out[lead - 1] === ' ' || out[lead - 1] === '\t')) lead--
    if (lead === 0 || out[lead - 1] === '\n') {
      start = lead
      let t = end
      while (t < out.length && (out[t] === ' ' || out[t] === '\t')) t++
      if (out[t] === '\r') t++
      if (out[t] === '\n') t++
      end = t
    }
    out = out.slice(0, start) + out.slice(end)
  }
  return out
}

export function stripCategoryLinks(text: string): string {
  const alt = getCategoryNamespaceAlt()
  const re = new RegExp(`\\[\\[\\s*(?:${alt})\\s*:[^\\]]*\\]\\]`, 'gi')
  const masked = maskIgnoredRegions(text)
  const ranges: Array<[number, number]> = []
  let m: RegExpExecArray | null
  while ((m = re.exec(masked))) ranges.push([m.index, m.index + m[0].length])

  let out = text
  for (let i = ranges.length - 1; i >= 0; i--) {
    let [s, e] = ranges[i]
    // A link leading a line also drops its indentation and trailing newline
    let lead = s
    while (lead > 0 && (out[lead - 1] === ' ' || out[lead - 1] === '\t')) lead--
    if (lead === 0 || out[lead - 1] === '\n') {
      s = lead
      let t = e
      while (t < out.length && (out[t] === ' ' || out[t] === '\t')) t++
      if (out[t] === '\r') t++
      if (out[t] === '\n') t++
      e = t
    }
    out = out.slice(0, s) + out.slice(e)
  }
  return out
}

export function renderLink(
  r: { name: string; sortkey?: string | null; ns?: string | null },
  defaultSort: string,
  defaultNs: string
): string | null {
  const name = stripCategoryPrefix(r.name)
  if (!name) return null
  const sk = String(r.sortkey || '').trim()
  const useDefault = !!defaultSort && sk.toLowerCase() === defaultSort.toLowerCase()
  const ns = String(r.ns || defaultNs).trim()
  return sk && !useDefault ? `[[${ns}:${name}|${sk}]]` : `[[${ns}:${name}]]`
}

// Full rebuild: strip old categories and DEFAULTSORT, append everything in order (used after drag reorder)
export function buildAppend(original: string, rows: CategoryRow[], defaultSort: string): string {
  let text = stripDefaultSort(original)
  text = stripCategoryLinks(text)
  text = text.replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '').replace(/[ \t\r\n]+$/, '')

  const defaultNs = getCategoryNamespaceName()
  const lines: string[] = []
  if (defaultSort) lines.push(`{{DEFAULTSORT:${defaultSort}}}`)
  for (const r of rows) {
    const link = renderLink(r, defaultSort, defaultNs)
    if (link) lines.push(link)
  }
  if (lines.length === 0) return `${text}\n`
  return `${text}\n${lines.join('\n')}\n`
}

// End offset of the last category link (HotCat-style insertion point); -1 if none
function findLastCategoryEnd(text: string): number {
  const alt = getCategoryNamespaceAlt()
  const re = new RegExp(
    `\\[\\[\\s*(?:${alt})\\s*:\\s*[^\\[\\]|]*?(?:\\s*\\|\\s*[^\\[\\]]*?)?\\s*\\]\\]`,
    'gi'
  )
  const masked = maskIgnoredRegions(text)
  let end = -1
  let m: RegExpExecArray | null
  while ((m = re.exec(masked))) end = m.index + m[0].length
  return end
}

// In-place update (HotCat style): existing categories keep their positions,
// DEFAULTSORT is replaced in place, new categories follow the last category link
export function buildInPlace(
  original: string,
  rows: CategoryRow[],
  defaultSort: string,
  originalCats: CategoryRef[]
): string {
  const defaultNs = getCategoryNamespaceName()
  const rowById = new Map<number, CategoryRow>()
  for (const r of rows) if (r._id != null) rowById.set(r._id, r)
  const additions = rows.filter((r) => r._id == null)

  // Collect all in-place replacements (categories + DEFAULTSORT) and apply them
  // from the end so offsets stay valid even when edits change text length
  const dsMatches = findDefaultSortMatches(original)
  const edits: Array<{ start: number; end: number; text: string }> = []
  for (const c of originalCats) {
    const row = rowById.get(c._id)
    const link = row ? (renderLink(row, defaultSort, defaultNs) ?? '') : ''
    let start = c.start
    let end = c.end
    if (!link) {
      // A deleted category that owns its line also removes the surrounding
      // indentation and newline so no blank line is left behind
      const lineStart = original.lastIndexOf('\n', c.start - 1) + 1
      const lineEndRel = original.indexOf('\n', c.end)
      const lineEnd = lineEndRel === -1 ? original.length : lineEndRel
      const before = original.slice(lineStart, c.start)
      const after = original.slice(c.end, lineEnd)
      if (/^[ \t]*$/.test(before) && /^[ \t]*$/.test(after)) {
        start = lineStart
        end = lineEnd < original.length ? lineEnd + 1 : lineEnd
      }
    }
    edits.push({ start, end, text: link })
  }
  for (const m of dsMatches) {
    edits.push({
      start: m.start,
      end: m.end + 2, // skip the closing }}
      text: defaultSort ? `{{DEFAULTSORT:${defaultSort}}}` : '',
    })
  }
  edits.sort((a, b) => b.start - a.start)
  let text = original
  for (const e of edits) {
    text = text.slice(0, e.start) + e.text + text.slice(e.end)
  }
  text = text.replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '').replace(/[ \t\r\n]+$/, '')

  // Insert new categories (and DEFAULTSORT if absent) right after the last
  // category link (HotCat behavior), so they stay with the existing categories
  // instead of landing at the bottom of the page.
  const newLines: string[] = []
  if (defaultSort && !dsMatches.length) newLines.push(`{{DEFAULTSORT:${defaultSort}}}`)
  for (const r of additions) {
    const link = renderLink(r, defaultSort, defaultNs)
    if (link) newLines.push(link)
  }
  if (newLines.length === 0) return `${text}\n`
  const insertAt = findLastCategoryEnd(text)
  if (insertAt >= 0) {
    const suffix = text.slice(insertAt)
    text = text.slice(0, insertAt) + '\n' + newLines.join('\n')
    if (suffix.length && !suffix.startsWith('\n')) text += '\n'
    text += suffix
    return `${text}\n`
  }
  return `${text}\n${newLines.join('\n')}\n`
}

// True when the user reordered existing categories via drag
// (a full rebuild is then used; otherwise update in place)
export function isReordered(rows: CategoryRow[], originalCats: CategoryRef[]): boolean {
  const orig = originalCats
    .filter((c) => rows.some((r) => r._id === c._id))
    .map((c) => c._id)
  const cur = rows.filter((r) => r._id != null).map((r) => r._id as number)
  return orig.join(',') !== cur.join(',')
}

export function buildWikitext(
  original: string,
  rows: CategoryRow[],
  defaultSort: string,
  originalCats: CategoryRef[] = []
): string {
  if (isReordered(rows, originalCats)) return buildAppend(original, rows, defaultSort)
  return buildInPlace(original, rows, defaultSort, originalCats)
}

// Deterministic comparison of the generated text to detect changes
export function isUnchanged(state: {
  content: string
  categories: CategoryRef[]
  originalDefaultSort: string
  rows: CategoryRow[]
  defaultSort: string
}): boolean {
  const a = buildWikitext(state.content, state.categories, state.originalDefaultSort, state.categories)
  const b = buildWikitext(state.content, state.rows, state.defaultSort, state.categories)
  return a === b
}
