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

export interface CategoryNsInfo {
  alt: string
  name: string
}

export function escapeRegExp(str: string): string {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Blank comments, nowiki-like tags and non-DEFAULTSORT templates so their
// category links are ignored. Pure (no memo); callers may cache if needed.
const RAW_TAGS = ['nowiki', 'pre', 'code', 'math', 'syntaxhighlight', 'source', 'timeline', 'poem', 'hiero']

// End offset after balanced {{...}} at i ('{' of '{{'); -1 if unclosed
function skipTemplate(text: string, i: number): number {
  let depth = 1
  let j = i + 2
  while (j < text.length && depth > 0) {
    if (text.startsWith('{{', j)) {
      depth++
      j += 2
    } else if (text.startsWith('}}', j)) {
      depth--
      j += 2
    } else {
      j++
    }
  }
  return depth === 0 ? j : -1
}

// True when text[i] starts the DEFAULTSORT magic word (kept unmasked)
function isDefaultSortStart(text: string, i: number): boolean {
  let k = i + 2
  while (k < text.length && /\s/.test(text[k])) k++
  const rest = text.slice(k).toLowerCase()
  return rest.startsWith('defaultsort:') || rest.startsWith('defaultsortkey:')
}

function maskIgnoredRegions(text: string): string {
  let masked = text.replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length))
  for (const tag of RAW_TAGS) {
    masked = masked.replace(
      new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?<\\/${tag}>`, 'gi'),
      (m) => ' '.repeat(m.length)
    )
  }
  const chars = masked.split('')
  for (let i = 0; i < chars.length; i++) {
    if (!masked.startsWith('{{', i)) continue
    const end = skipTemplate(masked, i)
    if (end === -1) continue // skip unclosed template
    if (isDefaultSortStart(masked, i)) {
      i = end - 1
      continue
    }
    for (let k = i; k < end; k++) chars[k] = ' '
    i = end - 1
  }
  return chars.join('')
}

function readNamespaceInfo(): CategoryNsInfo {
  let nsIds: Record<string, number> = {}
  let formatted: Record<string, string> = {}
  try {
    nsIds = (mw.config.get('wgNamespaceIds') as Record<string, number>) || {}
    formatted = (mw.config.get('wgFormattedNamespaces') as Record<string, string>) || {}
  } catch {
    /* ignore */
  }
  const canonicalId = Number(nsIds['category']) || 14
  const prefixes = new Set(['Category'])
  for (const [name, id] of Object.entries(nsIds)) {
    if (Number(id) === canonicalId && name) prefixes.add(name)
  }
  const alt = [...prefixes]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|')
  const name = String(formatted[String(canonicalId)]) || 'Category'
  return { alt, name }
}

// Localized category namespace aliases + canonical name; callers create once
// and pass it in (no hidden global state)
export function initCategoryNsInfo(): CategoryNsInfo {
  return readNamespaceInfo()
}

export function stripCategoryPrefix(name: string, nsInfo: CategoryNsInfo): string {
  return String(name).replace(new RegExp(`^\\s*(?:${nsInfo.alt})\\s*:`, 'i'), '').trim()
}

export function findDefaultSortMatches(text: string): DefaultSortMatch[] {
  const matches: DefaultSortMatch[] = []
  const masked = maskIgnoredRegions(text)
  const re = /\{\{\s*(?:DEFAULTSORT|DEFAULTSORTKEY)\s*:\s*/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(masked))) {
    const close = skipTemplate(masked, m.index)
    if (close === -1) continue // skip unclosed
    const end = close - 2
    matches.push({ start: m.index, end, value: text.slice(re.lastIndex, end).trim() })
  }
  return matches
}

// Exclude display links (e.g. [[:Category:...]]) and ignored regions
export function parseCategories(wikitext: string, nsInfo: CategoryNsInfo): Parsed {
  const categories: CategoryRef[] = []
  const ds = findDefaultSortMatches(wikitext)
  const re = new RegExp(
    `\\[\\[\\s*(?<ns>${nsInfo.alt})\\s*:\\s*(?<name>[^\\[\\]|]*?)(?:\\s*\\|\\s*(?<sortkey>[^\\[\\]]*?))?\\s*\\]\\]`,
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
  // Reuse findDefaultSortMatches so masked DEFAULTSORT is ignored too
  const matches = findDefaultSortMatches(text)
  let out = text
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i]
    let start = m.start
    let end = m.end + 2 // include the closing }}
    // Line-leading links also drop indentation and the trailing newline
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

// All matches of re in the masked text, as [start, end) offsets
function findMaskedRanges(text: string, re: RegExp): Array<[number, number]> {
  const masked = maskIgnoredRegions(text)
  const ranges: Array<[number, number]> = []
  let m: RegExpExecArray | null
  while ((m = re.exec(masked))) ranges.push([m.index, m.index + m[0].length])
  return ranges
}

export function stripCategoryLinks(text: string, nsInfo: CategoryNsInfo): string {
  const re = new RegExp(`\\[\\[\\s*(?:${nsInfo.alt})\\s*:[^\\]]*\\]\\]`, 'gi')
  const ranges = findMaskedRanges(text, re)

  let out = text
  for (let i = ranges.length - 1; i >= 0; i--) {
    let [s, e] = ranges[i]
    // Line-leading links also drop indentation and the trailing newline
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
  nsInfo: CategoryNsInfo
): string | null {
  const name = stripCategoryPrefix(r.name, nsInfo)
  if (!name) return null
  const sk = String(r.sortkey || '').trim()
  const useDefault = !!defaultSort && sk.toLowerCase() === defaultSort.toLowerCase()
  const ns = String(r.ns || nsInfo.name).trim()
  return sk && !useDefault ? `[[${ns}:${name}|${sk}]]` : `[[${ns}:${name}]]`
}

// Render category lines (DEFAULTSORT first, then rows)
function renderCategoryLines(rows: CategoryRow[], defaultSort: string, nsInfo: CategoryNsInfo): string[] {
  const lines: string[] = []
  if (defaultSort) lines.push(`{{DEFAULTSORT:${defaultSort}}}`)
  for (const r of rows) {
    const link = renderLink(r, defaultSort, nsInfo)
    if (link) lines.push(link)
  }
  return lines
}

// Span from the first to the last category / DEFAULTSORT occurrence
function findCategoryBlock(
  cats: CategoryRef[],
  dsMatches: DefaultSortMatch[]
): { start: number; end: number } | null {
  if (!cats.length && !dsMatches.length) return null
  const starts = [...cats.map((c) => c.start), ...dsMatches.map((m) => m.start)]
  const ends = [...cats.map((c) => c.end), ...dsMatches.map((m) => m.end + 2)]
  return { start: Math.min(...starts), end: Math.max(...ends) }
}

// True when the block is only categories/whitespace (rebuildable in place)
function isBlockContiguous(
  text: string,
  block: { start: number; end: number },
  cats: CategoryRef[],
  dsMatches: DefaultSortMatch[]
): boolean {
  const kept: Array<[number, number]> = [
    ...cats.map((c) => [c.start, c.end] as [number, number]),
    ...dsMatches.map((m) => [m.start, m.end + 2] as [number, number]),
  ].sort((a, b) => a[0] - b[0])
  let pos = block.start
  for (const [s, e] of kept) {
    if (s < pos) return false
    if (text.slice(pos, s).trim() !== '') return false
    pos = Math.max(pos, e)
  }
  return text.slice(pos, block.end).trim() === ''
}

// Rebuild the block in place, keeping the surrounding body intact
function rebuildBlock(
  original: string,
  block: { start: number; end: number },
  lines: string[]
): string {
  const before = original.slice(0, block.start)
  const after = original.slice(block.end)
  const beforeOk = before.length === 0 || before.endsWith('\n') ? before : before + '\n'
  let out = beforeOk + lines.join('\n')
  if (after.length === 0) out += '\n'
  else if (!after.startsWith('\n')) out += '\n' + after
  else out += after
  return out
}

// End offset of the last category link (HotCat insertion point); -1 if none
function findLastCategoryEnd(text: string, nsInfo: CategoryNsInfo): number {
  const re = new RegExp(
    `\\[\\[\\s*(?:${nsInfo.alt})\\s*:\\s*[^\\[\\]|]*?(?:\\s*\\|\\s*[^\\[\\]]*?)?\\s*\\]\\]`,
    'gi'
  )
  const ranges = findMaskedRanges(text, re)
  return ranges.length ? ranges[ranges.length - 1][1] : -1
}

// True when the user reordered existing categories via drag, or placed an added
// category before/among existing ones (HotCat in-place insertion can't do that)
export function isReordered(rows: CategoryRow[], originalCats: CategoryRef[]): boolean {
  const orig = originalCats
    .filter((c) => rows.some((r) => r._id === c._id))
    .map((c) => c._id)
  const cur = rows.filter((r) => r._id != null).map((r) => r._id as number)
  if (orig.join(',') !== cur.join(',')) return true
  // An added (no _id) category among existing ones also counts as reorder
  let seenNew = false
  for (const r of rows) {
    if (r._id == null) seenNew = true
    else if (seenNew) return true
  }
  return false
}

// Reorder: rebuild the contiguous block in place, else strip + append at end.
function buildReorderedWikitext(
  original: string,
  rows: CategoryRow[],
  defaultSort: string,
  originalCats: CategoryRef[],
  nsInfo: CategoryNsInfo
): string {
  const lines = renderCategoryLines(rows, defaultSort, nsInfo)
  const dsMatches = findDefaultSortMatches(original)
  const block = findCategoryBlock(originalCats, dsMatches)
  if (block && lines.length && isBlockContiguous(original, block, originalCats, dsMatches)) {
    return rebuildBlock(original, block, lines)
  }
  // Fallback: strip the old block, append at end (keeps body content)
  let text = stripDefaultSort(original)
  text = stripCategoryLinks(text, nsInfo)
  // Only clean the tail so unrelated blank lines in the body are preserved
  text = text.replace(/[ \t\r\n]+$/, '')
  if (lines.length === 0) return `${text}\n`
  return `${text}\n${lines.join('\n')}\n`
}

// Apply edits from the end so offsets stay valid even when text length changes
interface TextEdit {
  start: number
  end: number
  text: string
}
function applyTextEdits(original: string, edits: TextEdit[]): string {
  const sorted = [...edits].sort((a, b) => b.start - a.start)
  let text = original
  for (const e of sorted) {
    text = text.slice(0, e.start) + e.text + text.slice(e.end)
  }
  return text
}

// In-place: edit existing categories + DEFAULTSORT, then insert new categories
// after the last link (HotCat behavior) so they stay with the existing ones
function buildInPlaceWikitext(
  original: string,
  rows: CategoryRow[],
  defaultSort: string,
  originalCats: CategoryRef[],
  nsInfo: CategoryNsInfo
): string {
  const rowById = new Map<number, CategoryRow>()
  for (const r of rows) if (r._id != null) rowById.set(r._id, r)
  const additions = rows.filter((r) => r._id == null)

  const dsMatches = findDefaultSortMatches(original)
  const edits: TextEdit[] = []
  for (const c of originalCats) {
    const row = rowById.get(c._id)
    const link = row ? (renderLink(row, defaultSort, nsInfo) ?? '') : ''
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
  let text = applyTextEdits(original, edits)
  // Only clean the tail so unrelated blank lines in the body are preserved
  text = text.replace(/[ \t\r\n]+$/, '')

  const newLines: string[] = []
  if (defaultSort && !dsMatches.length) newLines.push(`{{DEFAULTSORT:${defaultSort}}}`)
  for (const r of additions) {
    const link = renderLink(r, defaultSort, nsInfo)
    if (link) newLines.push(link)
  }
  if (newLines.length === 0) return `${text}\n`
  const insertAt = findLastCategoryEnd(text, nsInfo)
  if (insertAt >= 0) {
    const suffix = text.slice(insertAt)
    text = text.slice(0, insertAt) + '\n' + newLines.join('\n')
    if (suffix.length && !suffix.startsWith('\n')) text += '\n'
    text += suffix
    return `${text}\n`
  }
  return `${text}\n${newLines.join('\n')}\n`
}

// Reorder: rebuild the contiguous block in place, else strip + append at end.
// Otherwise: edit in place; insert new cats after the last link (HotCat).
export function buildWikitext(
  original: string,
  rows: CategoryRow[],
  defaultSort: string,
  originalCats: CategoryRef[],
  nsInfo: CategoryNsInfo
): string {
  if (isReordered(rows, originalCats)) {
    return buildReorderedWikitext(original, rows, defaultSort, originalCats, nsInfo)
  }
  return buildInPlaceWikitext(original, rows, defaultSort, originalCats, nsInfo)
}

// Deterministic comparison of the generated text to detect changes
export function isUnchanged(
  state: {
    content: string
    categories: CategoryRef[]
    originalDefaultSort: string
    rows: CategoryRow[]
    defaultSort: string
  },
  nsInfo: CategoryNsInfo
): boolean {
  const a = buildWikitext(state.content, state.categories, state.originalDefaultSort, state.categories, nsInfo)
  const b = buildWikitext(state.content, state.rows, state.defaultSort, state.categories, nsInfo)
  return a === b
}
