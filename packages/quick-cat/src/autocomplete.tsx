import { stripCategoryPrefix } from './parse.js'
import type { QuickCatContext } from './types.js'

export interface CategorySuggestion {
  name: string
  redirect: string | null
}

export interface AutocompleteHandlers {
  onPick?: (cat: string) => void
  onEnter?: () => void
}

// Per-context search cache, 5-minute TTL
const SEARCH_CACHE_TTL = 5 * 60 * 1000
const searchCaches = new WeakMap<object, Map<string, { ts: number; items: CategorySuggestion[] }>>()

function getSearchCache(ctx: object): Map<string, { ts: number; items: CategorySuggestion[] }> {
  let cache = searchCaches.get(ctx)
  if (!cache) {
    cache = new Map()
    searchCaches.set(ctx, cache)
  }
  return cache
}

// Search existing category pages (incl. hard redirects); cached by prefix
export async function searchCategories(
  qc: QuickCatContext,
  query: string
): Promise<CategorySuggestion[]> {
  const q = stripCategoryPrefix(query, qc.nsInfo)
  if (!q) return []
  const cache = getSearchCache(qc.ctx)
  const hit = cache.get(q)
  if (hit && Date.now() - hit.ts < SEARCH_CACHE_TTL) return hit.items

  const nsId = Number((mw.config.get('wgNamespaceIds') as Record<string, number>)?.category) || 14
  try {
    // opensearch: relevance-ranked suggestions (HotCat's primary engine);
    // allpages: prefix list as a fallback for the exact prefix
    const [osRes, apRes] = await Promise.all([
      qc.ctx.api.get({ action: 'opensearch', search: q, namespace: nsId, limit: 10 }),
      qc.ctx.api.get({
        action: 'query',
        generator: 'allpages',
        gapnamespace: nsId,
        gapprefix: q,
        gaplimit: 10,
        prop: 'info',
      }),
    ])
    const osTitles: string[] = osRes?.data?.[1] || []
    const apTitles = Object.values(apRes?.data?.query?.pages || {})
      .filter((p: any) => p && !p.missing && p.title)
      .map((p: any) => p.title)

    // Merge (opensearch first), dedupe by bare name
    const seen = new Set<string>()
    const titles: string[] = []
    for (const t of [...osTitles, ...apTitles]) {
      const name = stripCategoryPrefix(t, qc.nsInfo)
      if (!name || seen.has(name)) continue
      seen.add(name)
      titles.push(t)
    }

    // Resolve hard redirects (prop=info flags them; redirects=1 gets targets)
    const redirectMap = new Map<string, string>()
    if (titles.length) {
      try {
        const { data } = await qc.ctx.api.get({
          action: 'query',
          prop: 'info',
          titles: titles.join('|'),
        })
        const redirectTitles = Object.values(data?.query?.pages || {})
          .filter((p: any) => p && (typeof p.redirect === 'string' || p.redirect === true))
          .map((p: any) => p.title)
        if (redirectTitles.length) {
          const { data: d2 } = await qc.ctx.api.get({
            action: 'query',
            redirects: 1,
            prop: 'info',
            titles: redirectTitles.join('|'),
          })
          for (const r of d2?.query?.redirects || []) {
            if (r.from && r.to) redirectMap.set(r.from, r.to)
          }
        }
      } catch (e) {
        qc.logger.warn('resolve redirect targets failed:', e)
      }
    }

    const items: CategorySuggestion[] = titles.map((t) => {
      const target = redirectMap.get(t)
      return {
        name: stripCategoryPrefix(t, qc.nsInfo),
        redirect: target ? stripCategoryPrefix(target, qc.nsInfo) : null,
      }
    })

    // HotCat-style relevance sort: prefix containment (shorter first), then
    // prefix match, case-insensitive prefix, and lexicographic fallback
    items.sort((a, b) => {
      const na = a.name
      const nb = b.name
      if (na === nb) return 0
      if (na.indexOf(nb) === 0) return 1
      if (nb.indexOf(na) === 0) return -1
      const aPre = na.indexOf(q) === 0 ? 1 : 0
      const bPre = nb.indexOf(q) === 0 ? 1 : 0
      if (aPre !== bPre) return bPre - aPre
      const aLow = na.toLowerCase()
      const bLow = nb.toLowerCase()
      const qLow = q.toLowerCase()
      const aPreL = aLow.indexOf(qLow) === 0 ? 1 : 0
      const bPreL = bLow.indexOf(qLow) === 0 ? 1 : 0
      if (aPreL !== bPreL) return bPreL - aPreL
      if (aLow < bLow) return -1
      if (bLow < aLow) return 1
      return 0
    })

    cache.set(q, { ts: Date.now(), items })
    return items
  } catch (e) {
    qc.logger.warn('searchCategories failed:', e)
    return []
  }
}

// Generic autocomplete dropdown: debounced input, guarded by a request sequence
export function attachAutocomplete(
  qc: QuickCatContext,
  m: any,
  input: HTMLInputElement,
  suggest: HTMLElement,
  handlers: AutocompleteHandlers = {}
): void {
  // Render as a fixed portal on body so the scrollable list can't clip it
  const hideSuggest = () => {
    suggest.remove()
    suggest.textContent = ''
    optionEls = []
    activeIndex = 0
    input.setAttribute('aria-expanded', 'false')
    input.removeAttribute('aria-activedescendant')
  }
  const positionSuggest = () => {
    if (!suggest.children.length) return
    const ir = input.getBoundingClientRect()
    const vh = window.innerHeight
    const want = 220
    const spaceBelow = vh - ir.bottom
    const spaceAbove = ir.top
    suggest.style.width = `${Math.max(ir.width, 140)}px`
    if (spaceBelow >= Math.min(want, 200) || spaceBelow >= spaceAbove) {
      suggest.style.top = `${ir.bottom + 4}px`
      suggest.style.bottom = 'auto'
      suggest.style.maxHeight = `${Math.max(60, Math.min(want, spaceBelow - 8))}px`
    } else {
      suggest.style.top = 'auto'
      suggest.style.bottom = `${vh - ir.top + 4}px`
      suggest.style.maxHeight = `${Math.max(60, Math.min(want, spaceAbove - 8))}px`
    }
    suggest.style.left = `${ir.left}px`
    suggest.style.display = 'block'
    if (suggest.parentElement !== document.body) document.body.appendChild(suggest)
  }

  let timer: ReturnType<typeof setTimeout> | null = null
  let searchSeq = 0
  let optionEls: HTMLButtonElement[] = []
  let activeIndex = 0

  // ARIA combobox wiring
  input.setAttribute('role', 'combobox')
  input.setAttribute('aria-autocomplete', 'list')
  input.setAttribute('aria-expanded', 'false')
  suggest.id = suggest.id || `ipe-quick-cat__suggest-${++qc.suggestSeq}`
  input.setAttribute('aria-controls', suggest.id)
  suggest.setAttribute('role', 'listbox')

  const setActive = (index: number) => {
    if (!optionEls.length) return
    activeIndex = (index + optionEls.length) % optionEls.length
    optionEls.forEach((el, i) => {
      const on = i === activeIndex
      el.classList.toggle('is-active', on)
      el.setAttribute('aria-selected', String(on))
    })
    input.setAttribute('aria-activedescendant', optionEls[activeIndex].id)
    optionEls[activeIndex].scrollIntoView({ block: 'nearest' })
  }

  const render = (resultItems: CategorySuggestion[]) => {
    suggest.textContent = ''
    optionEls = []
    if (!resultItems.length) {
      hideSuggest()
      return
    }
    for (const item of resultItems) {
      const isRedirect = !!item.redirect
      const btn = (
        <button
          id={`ipe-quick-cat__opt-${++qc.optSeq}`}
          className={
            isRedirect
              ? 'ipe-quick-cat__suggest-item is-redirect'
              : 'ipe-quick-cat__suggest-item'
          }
          type="button"
          role="option"
          aria-selected="false"
          title={isRedirect ? item.redirect || undefined : undefined}
          onClick={() => {
            // Pick the redirect target so the real category is saved
            const value = isRedirect ? (item.redirect ?? item.name) : item.name
            if (handlers.onPick) handlers.onPick(value)
            else input.value = value
            hideSuggest()
            input.focus()
          }}
        >
          {item.name}
        </button>
      ) as HTMLButtonElement
      if (isRedirect) {
        btn.append(
          <span className="ipe-quick-cat__suggest-redirect">{`→ ${item.redirect}`}</span>
        )
      }
      optionEls.push(btn)
      suggest.append(btn)
    }
    input.setAttribute('aria-expanded', 'true')
    setActive(0)
    positionSuggest()
  }

  input.addEventListener('input', () => {
    if (timer) clearTimeout(timer)
    const q = stripCategoryPrefix(input.value, qc.nsInfo)
    if (!q) {
      hideSuggest()
      return
    }
    const seq = ++searchSeq
    timer = setTimeout(() => {
      searchCategories(qc, q)
        .then((items) => {
          if (m.isDestroyed || seq !== searchSeq) return
          render(items)
        })
        .catch(() => hideSuggest())
    }, 200)
  })
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (optionEls.length) setActive(activeIndex + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (optionEls.length) setActive(activeIndex - 1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (optionEls.length) optionEls[activeIndex]?.click()
      else if (handlers.onEnter) handlers.onEnter()
    } else if (e.key === 'Escape') {
      hideSuggest()
      input.blur()
    }
  })
  const onDocClick = (e: MouseEvent) => {
    if (m.isDestroyed) {
      document.removeEventListener('click', onDocClick)
      return
    }
    if (!suggest.contains(e.target as Node) && !input.contains(e.target as Node)) hideSuggest()
  }
  document.addEventListener('click', onDocClick)
  m.on(m.Event.Close, () => {
    suggest.remove()
    document.removeEventListener('click', onDocClick)
  })
}
