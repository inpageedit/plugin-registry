import './style.scss'

import {
  Schema,
  type CurrentPageService,
  type IWikiPage,
  type InPageEdit,
  type PreferencesService,
  type WikiPageService,
} from '@inpageedit/core'

import { defineIPEPlugin } from '~~/defineIPEPlugin.js'
import {
  buildWikitext,
  isUnchanged,
  parseCategories,
  stripCategoryPrefix,
  type CategoryRef,
  type CategoryRow,
} from './parse.js'

const PLUGIN_NAME = 'quick-cat'
const APPLIED_FLAG = Symbol.for('ipe-quick-cat.applied')

// Route logging through the framework logger (ctx.logger) once available,
// falling back to console in standalone/test contexts
let _logger: {
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
} | null = null
const log = {
  info: (...args: unknown[]) => (_logger ? _logger.info(...args) : console.info('[IPE-QuickCat]', ...args)),
  warn: (...args: unknown[]) => (_logger ? _logger.warn(...args) : console.warn('[IPE-QuickCat]', ...args)),
  error: (...args: unknown[]) => (_logger ? _logger.error(...args) : console.error('[IPE-QuickCat]', ...args)),
}

type Ctx = InPageEdit & {
  $$: (strings: TemplateStringsArray, ...args: unknown[]) => string
  api: any // MwApi instance (wiki-saikou); no stable re-export from core
  currentPage?: CurrentPageService
  modal: any // ModalService; the modal instance API is chained (createObject().init())
  wikiPage: WikiPageService
  preferences: PreferencesService
  toolbox: any
}

const I18N: Record<'zh' | 'en', Record<string, string>> = {
  zh: {
    tooltip: '快速分类',
    tooltipNotEditable: '当前页面不可编辑',
    modalTitle: '快速分类',
    cancel: '取消',
    save: '保存',
    add: '添加',
    addPh: '输入分类名以添加',
    namePh: '分类名',
    sortKeyPh: '排序键（可选）',
    remove: '移除该分类',
    drag: '拖动排序',
    selectAll: '全选',
    selectedCount: '已选 {{ $1 }} 项',
    deleteSelected: '删除所选',
    defaultSort: '默认排序键',
    noCategories: '此页面没有直接书写的分类。',
    loading: '正在加载分类…',
    loadFailed: '分类加载失败',
    invalidTitle: '分类名无效',
    invalidTitleDesc: '分类名不能为空，且不能包含 [ ] | # < > { } 等字符。',
    duplicate: '该分类已存在',
    noChange: '没有需要保存的更改',
    saved: '分类已保存',
    savedDesc: '页面分类已成功更新。',
    summaryLabel: '编辑摘要',
    summaryPh: '[IPE-NEXT] Quick Cat',
    summaryDefault: '[IPE-NEXT] Quick Cat',
    minorEdit: '小编辑',
    reloadAfterSave: '保存后刷新页面',
    notEditable: '当前页面不可编辑，无法修改分类。',
    submissionError: '提交失败',
    reopenToRetry: '页面已被他人修改或删除，请重新打开后重试。',
  },
  en: {
    tooltip: 'Quick Cat',
    tooltipNotEditable: 'Page is not editable',
    modalTitle: 'Quick Cat',
    cancel: 'Cancel',
    save: 'Save',
    add: 'Add',
    addPh: 'Type a category to add',
    namePh: 'Category name',
    sortKeyPh: 'Sort key (optional)',
    remove: 'Remove this category',
    drag: 'Drag to reorder',
    selectAll: 'Select all',
    selectedCount: '{{ $1 }} selected',
    deleteSelected: 'Delete selected',
    defaultSort: 'Default sort key',
    noCategories: 'This page has no directly written categories.',
    loading: 'Loading categories…',
    loadFailed: 'Failed to load categories',
    invalidTitle: 'Invalid category name',
    invalidTitleDesc: 'Category names cannot be empty or contain [ ] | # < > { }.',
    duplicate: 'Category already exists',
    noChange: 'No changes to save',
    saved: 'Categories saved',
    savedDesc: 'Page categories have been updated.',
    summaryLabel: 'Edit summary',
    summaryPh: '[IPE-NEXT] Quick Cat',
    summaryDefault: '[IPE-NEXT] Quick Cat',
    minorEdit: 'Minor edit',
    reloadAfterSave: 'Reload page after saving',
    notEditable: 'This page is not editable.',
    submissionError: 'Submission Error',
    reopenToRetry: 'The page was modified or deleted by someone else. Reopen the dialog and try again.',
  },
}

const OFFICIAL_KEYS: Record<string, string> = {
  cancel: 'Cancel',
  save: 'Save',
  add: 'Add',
  remove: 'Remove',
  minorEdit: 'Minor edit',
  reloadAfterSave: 'Reload after save',
  noChange: 'No changes',
  notEditable: 'Not editable',
  saved: 'Your changes have been saved.',
  summaryLabel: 'Summary',
  submissionError: 'Submission Error',
}

let currentCtx: Ctx | null = null
let suggestSeq = 0
let optSeq = 0

// Lightweight i18n: reuse the official dict when possible, else built-in zh/en
function i18n(key: string, ...args: (string | number)[]): string {
  const interpolateMsg = (msg: string) =>
    args.length
      ? msg.replace(/\{\{\s*\$(\d+)\s*\}\}/g, (_, i) => String(args[Number(i) - 1] ?? ''))
      : msg

  const official = OFFICIAL_KEYS[key]
  if (official && currentCtx && currentCtx.$$) {
    try {
      // Call the $$ tag function with a synthetic template
      const ts = Object.assign([official], { raw: [official] }) as unknown as TemplateStringsArray
      const officialMsg = currentCtx.$$(ts)
      if (officialMsg && officialMsg !== `(${official})`) {
        return interpolateMsg(officialMsg)
      }
    } catch {
      /* fallback to built-in dict */
    }
  }

  let lang = 'zh-cn'
  try {
    lang = (mw.config.get('wgUserLanguage') as string) || lang
  } catch {
    /* ignore */
  }
  const table = String(lang).toLowerCase().startsWith('zh') ? I18N.zh : I18N.en
  return interpolateMsg(table[key] ?? I18N.en[key] ?? key)
}

function h(
  tag: string,
  props: Record<string, any> = {},
  ...children: (Node | string | number | false | null | undefined)[]
): HTMLElement {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue
    if (k === 'class' || k === 'className') {
      el.className = v
      continue
    }
    if (k === 'style') {
      Object.assign(el.style, v)
      continue
    }
    if (k === 'value') {
      ;(el as HTMLInputElement).value = v
      continue
    }
    if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v as EventListener)
      continue
    }
    el.setAttribute(k, v === true ? '' : String(v))
  }
  for (const c of children) {
    if (c == null || c === false) continue
    el.append(c instanceof Node ? c : document.createTextNode(String(c)))
  }
  return el
}

const TAG_ICON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="icon icon-tabler icons-tabler-outline icon-tabler-tag">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3" />
  </svg>
`
function createSvgIcon(svg: string): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = svg.trim()
  return wrapper.firstElementChild as HTMLElement
}
const createTagIcon = () => createSvgIcon(TAG_ICON_SVG)

const INFO_ICON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M12 9h.01" />
    <path d="M11 12h1v4h1" />
  </svg>
`
const createInfoIcon = () => createSvgIcon(INFO_ICON_SVG)

let _defaultSortHelpCache: string | null = null

// Fetch the default-sort help: API (allmessages) first, then mw.msg, then built-in
async function getDefaultSortHelp(ctx: Ctx): Promise<string> {
  if (_defaultSortHelpCache) return _defaultSortHelpCache
  const key = 'visualeditor-dialog-meta-categories-defaultsort-help'
  let lang: string = 'zh'
  try {
    lang =
      (mw.config.get('wgContentLanguage') as string) ||
      (mw.config.get('wgUserLanguage') as string) ||
      lang
  } catch {
    /* ignore */
  }

  try {
    const { data } = await ctx.api.get({
      action: 'query',
      meta: 'allmessages',
      ammessages: key,
      amlang: lang,
      amincludelocal: 1,
    })
    const m = data?.query?.allmessages?.[0]
    // formatversion=2 exposes 'content'; legacy uses '*'
    const text: string | undefined = m && (m['*'] || m.content)
    if (m && !m.missing && text && text !== key) {
      _defaultSortHelpCache = text
      log.info('default sort help resolved via API (lang=' + lang + ')')
      return text
    }
    log.warn('default sort help: API returned no message (lang=' + lang + ')')
  } catch (e) {
    log.warn('getDefaultSortHelp api failed:', e)
  }

  try {
    if (mw.msg) {
      const msg = mw.msg(key)
      // mw.msg returns the key itself when the message is missing
      if (msg && msg !== key && !/^[⧼([<]/.test(msg)) {
        _defaultSortHelpCache = msg
        return msg
      }
    }
  } catch {
    /* ignore */
  }

  _defaultSortHelpCache =
    'You can override how this page is sorted when displayed within a category by setting a different index to sort with instead. This is often used to make pages about people show by last name, but be named with their first name shown first.'
  log.warn('default sort help: fell back to built-in English')
  return _defaultSortHelpCache
}

interface CategorySuggestion {
  name: string
  redirect: string | null
}

// Per-context search cache, 5-minute TTL
const searchCaches = new WeakMap<object, Map<string, { ts: number; items: CategorySuggestion[] }>>()
const SEARCH_CACHE_TTL = 5 * 60 * 1000

function getSearchCache(ctx: Ctx): Map<string, { ts: number; items: CategorySuggestion[] }> {
  let cache = searchCaches.get(ctx)
  if (!cache) {
    cache = new Map()
    searchCaches.set(ctx, cache)
  }
  return cache
}

// Search existing category pages (incl. hard redirects); results cached by prefix
async function searchCategories(ctx: Ctx, query: string): Promise<CategorySuggestion[]> {
  const q = stripCategoryPrefix(query)
  if (!q) return []
  const cache = getSearchCache(ctx)
  const hit = cache.get(q)
  if (hit && Date.now() - hit.ts < SEARCH_CACHE_TTL) return hit.items

  const nsId = Number((mw.config.get('wgNamespaceIds') as Record<string, number>)?.category) || 14
  try {
    const { data } = await ctx.api.get({
      action: 'query',
      generator: 'allpages',
      gapnamespace: nsId,
      gapprefix: q,
      gaplimit: 10,
      prop: 'info',
    })
    const pages = data?.query?.pages || {}
    const pageList = Object.values(pages).filter((p: any) => p && !p.missing && p.title)
    // prop=info marks redirects (boolean on modern MW); resolve targets via redirects=1
    const redirectTitles = pageList
      .filter((p: any) => typeof p.redirect === 'string' || p.redirect === true)
      .map((p: any) => p.title)
    const redirectMap = new Map<string, string>()
    if (redirectTitles.length) {
      try {
        const { data: d2 } = await ctx.api.get({
          action: 'query',
          redirects: 1,
          prop: 'info',
          titles: redirectTitles.join('|'),
        })
        for (const r of d2?.query?.redirects || []) {
          if (r.from && r.to) redirectMap.set(r.from, r.to)
        }
      } catch (e) {
        log.warn('resolve redirect targets failed:', e)
      }
    }
    const items: CategorySuggestion[] = pageList.map((p: any) => {
      const target = redirectMap.get(p.title)
      return {
        name: stripCategoryPrefix(p.title),
        redirect: target ? stripCategoryPrefix(target) : null,
      }
    })
    cache.set(q, { ts: Date.now(), items })
    return items
  } catch (e) {
    log.warn('searchCategories failed:', e)
    return []
  }
}

interface AutocompleteHandlers {
  onPick?: (cat: string) => void
  onEnter?: () => void
}

// Generic autocomplete dropdown: debounced input, guarded by a request sequence
function attachAutocomplete(
  ctx: Ctx,
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
  suggest.id = suggest.id || `ipe-quick-cat__suggest-${++suggestSeq}`
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
      const btn = h(
        'button',
        {
          id: `ipe-quick-cat__opt-${++optSeq}`,
          class: isRedirect
            ? 'ipe-quick-cat__suggest-item is-redirect'
            : 'ipe-quick-cat__suggest-item',
          type: 'button',
          role: 'option',
          'aria-selected': 'false',
          title: isRedirect ? item.redirect : undefined,
          onClick: () => {
            // Pick the redirect target so the real category is saved
            const value = isRedirect ? (item.redirect ?? item.name) : item.name
            if (handlers.onPick) handlers.onPick(value)
            else input.value = value
            hideSuggest()
            input.focus()
          },
        },
        item.name
      ) as HTMLButtonElement
      if (isRedirect) {
        btn.append(h('span', { class: 'ipe-quick-cat__suggest-redirect' }, `→ ${item.redirect}`))
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
    const q = stripCategoryPrefix(input.value)
    if (!q) {
      hideSuggest()
      return
    }
    const seq = ++searchSeq
    timer = setTimeout(() => {
      searchCategories(ctx, q)
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

interface CategoryState {
  title: string
  pageName: string
  page: IWikiPage
  content: string
  categories: CategoryRef[]
  originalDefaultSort: string
  defaultSort: string
  summary: string
  minor: boolean
  reloadAfterSave: boolean
  selected: Set<CategoryRow>
  _dragIndex: number | null
  rows: CategoryRow[]
}

function createCategoryRow(
  ctx: Ctx,
  m: any,
  state: CategoryState,
  row: CategoryRow,
  refreshList: () => void,
  refreshToolbar: () => void
): HTMLElement {
  const rowEl = h('div', { class: 'ipe-quick-cat__row' })

  const check = h('input', {
    class: 'ipe-quick-cat__check',
    type: 'checkbox',
    checked: state.selected.has(row),
  }) as HTMLInputElement
  check.addEventListener('change', () => {
    if (check.checked) state.selected.add(row)
    else state.selected.delete(row)
    refreshToolbar()
  })

  const grip = h(
    'span',
    { class: 'ipe-quick-cat__grip', title: i18n('drag'), 'aria-label': i18n('drag') },
    '⠿'
  )
  // Pointer events drive the drag on both mouse and touch (HTML5 DnD has no touch support)
  grip.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.preventDefault()
    state._dragIndex = state.rows.indexOf(row)
    grip.setPointerCapture(e.pointerId)
    rowEl.classList.add('is-dragging')
  })

  const nameInput = h('input', {
    class: 'ipe-quick-cat__name',
    type: 'text',
    value: row.name,
    placeholder: i18n('namePh'),
    spellcheck: 'false',
    autocomplete: 'off',
  }) as HTMLInputElement
  nameInput.addEventListener('input', () => {
    row.name = nameInput.value.trim()
  })
  const nameSuggest = h('div', { class: 'ipe-quick-cat__suggest' })
  attachAutocomplete(ctx, m, nameInput, nameSuggest, {
    onPick: (cat) => {
      row.name = cat
      nameInput.value = cat
    },
  })
  const nameWrap = h('span', { class: 'ipe-quick-cat__namewrap' }, nameInput, nameSuggest)

  const sortInput = h('input', {
    class: 'ipe-quick-cat__sortkey',
    type: 'text',
    value: row.sortkey,
    placeholder: i18n('sortKeyPh'),
  }) as HTMLInputElement
  sortInput.addEventListener('input', () => {
    row.sortkey = sortInput.value.trim()
  })

  const removeBtn = h(
    'button',
    {
      class: 'ipe-quick-cat__remove',
      type: 'button',
      title: i18n('remove'),
      'aria-label': i18n('remove'),
      onClick: () => {
        state.rows = state.rows.filter((r) => r !== row)
        state.selected.delete(row)
        refreshList()
        refreshToolbar()
      },
    },
    '✕'
  )

  rowEl.append(check, grip, nameWrap, sortInput, removeBtn)
  return rowEl
}

function createAddBar(ctx: Ctx, m: any, state: CategoryState, refreshList: () => void): HTMLElement {
  const input = h('input', {
    class: 'ipe-quick-cat__new',
    type: 'text',
    placeholder: i18n('addPh'),
    autocomplete: 'off',
    spellcheck: 'false',
  }) as HTMLInputElement
  const suggest = h('div', { class: 'ipe-quick-cat__suggest' })
  const addBtn = h('button', { class: 'ipe-quick-cat__addbtn', type: 'button' }, i18n('add'))

  const doAdd = () => {
    const raw = stripCategoryPrefix(input.value)
    if (!raw) return
    const duplicate = state.rows.some((r) => r.name.toLowerCase() === raw.toLowerCase())
    if (duplicate) {
      ctx.modal.notify('warning', { title: i18n('duplicate'), content: `Category: ${raw}` })
      return
    }
    state.rows.push({ name: raw, sortkey: state.defaultSort, ns: null })
    input.value = ''
    suggest.textContent = ''
    refreshList()
    input.focus()
  }

  attachAutocomplete(ctx, m, input, suggest, { onEnter: doAdd })
  addBtn.addEventListener('click', doAdd)

  return h('div', { class: 'ipe-quick-cat__add' }, input, addBtn, suggest)
}

function renderDialog(ctx: Ctx, m: any, state: CategoryState): void {
  const root = h('div', { class: 'ipe-quick-cat' })

  const selectAll = h('input', { class: 'ipe-quick-cat__checkall', type: 'checkbox' }) as HTMLInputElement
  const countEl = h('span', { class: 'ipe-quick-cat__selected-count' }, i18n('selectedCount', 0))
  const deleteBtn = h(
    'button',
    { class: 'ipe-quick-cat__delete-selected', type: 'button', disabled: true },
    i18n('deleteSelected')
  ) as HTMLButtonElement

  const refreshToolbar = () => {
    const n = state.rows.length
    const sel = state.selected.size
    selectAll.checked = n > 0 && sel === n
    selectAll.indeterminate = sel > 0 && sel < n
    countEl.textContent = i18n('selectedCount', sel)
    deleteBtn.disabled = sel === 0
  }

  const list = h('div', { class: 'ipe-quick-cat__list' })

  // Drag sort: insertion index decided by each row's midpoint
  const computeInsertIndex = (clientY: number): number => {
    const rows = [...list.querySelectorAll('.ipe-quick-cat__row')]
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i].getBoundingClientRect()
      if (clientY < r.top + r.height / 2) return i
    }
    return rows.length
  }
  const clearIndicators = () => {
    list.querySelectorAll('.ipe-quick-cat__row').forEach((el) =>
      el.classList.remove('is-drop-before', 'is-drop-after')
    )
  }
  list.addEventListener('pointermove', (e) => {
    if (state._dragIndex == null) return
    e.preventDefault()
    // Auto-scroll when the pointer nears the list edges
    const rect = list.getBoundingClientRect()
    if (e.clientY < rect.top + 32) list.scrollTop -= 8
    else if (e.clientY > rect.bottom - 32) list.scrollTop += 8
    clearIndicators()
    const idx = computeInsertIndex(e.clientY)
    const rows = [...list.querySelectorAll('.ipe-quick-cat__row')]
    if (idx < rows.length) rows[idx].classList.add('is-drop-before')
    else if (rows.length) rows[rows.length - 1].classList.add('is-drop-after')
  })
  list.addEventListener('pointerup', (e) => {
    if (state._dragIndex == null) return
    const from = state._dragIndex
    const to = computeInsertIndex(e.clientY)
    const [moved] = state.rows.splice(from, 1)
    const target = from < to ? to - 1 : to
    state.rows.splice(target, 0, moved)
    state._dragIndex = null
    refreshList()
  })
  list.addEventListener('pointercancel', () => {
    state._dragIndex = null
    list.querySelectorAll('.ipe-quick-cat__row').forEach((el) =>
      el.classList.remove('is-dragging', 'is-drop-before', 'is-drop-after')
    )
  })

  selectAll.addEventListener('change', () => {
    if (selectAll.checked) state.rows.forEach((r) => state.selected.add(r))
    else state.selected.clear()
    list.querySelectorAll('.ipe-quick-cat__row').forEach((el) => {
      const cb = el.querySelector('.ipe-quick-cat__check') as HTMLInputElement | null
      if (cb) cb.checked = selectAll.checked
    })
    refreshToolbar()
  })
  deleteBtn.addEventListener('click', () => {
    if (!state.selected.size) return
    state.rows = state.rows.filter((r) => !state.selected.has(r))
    state.selected.clear()
    refreshList()
    refreshToolbar()
  })

  const toolbar = h(
    'div',
    { class: 'ipe-quick-cat__toolbar' },
    h(
      'label',
      { class: 'ipe-quick-cat__checkbox' },
      selectAll,
      h('span', {}, i18n('selectAll'))
    ),
    countEl,
    deleteBtn
  )

  const refreshList = () => {
    list.textContent = ''
    if (state.rows.length === 0) {
      list.append(h('div', { class: 'ipe-quick-cat__empty' }, i18n('noCategories')))
    } else {
      for (const row of state.rows) {
        list.append(createCategoryRow(ctx, m, state, row, refreshList, refreshToolbar))
      }
    }
    refreshToolbar()
  }
  refreshList()

  const addBar = createAddBar(ctx, m, state, refreshList)

  const dsInput = h('input', {
    class: 'ipe-quick-cat__ds-input',
    type: 'text',
    value: state.defaultSort,
    placeholder: state.pageName || '',
  }) as HTMLInputElement
  dsInput.addEventListener('input', () => {
    const oldDs = state.defaultSort
    const newDs = dsInput.value.trim()
    state.defaultSort = newDs
    // Rows inheriting the old default sort follow the new one (VE behavior);
    // clearing the default sort also clears those inherited sort keys
    if (oldDs && oldDs.toLowerCase() !== newDs.toLowerCase()) {
      const sameKey = (k: string) => !!k && k.toLowerCase() === oldDs.toLowerCase()
      state.rows.forEach((row) => {
        if (sameKey(row.sortkey)) row.sortkey = newDs
      })
      list.querySelectorAll('.ipe-quick-cat__row').forEach((rowEl, idx) => {
        const row = state.rows[idx]
        if (row) {
          const sortInput = rowEl.querySelector('.ipe-quick-cat__sortkey') as HTMLInputElement | null
          if (sortInput) sortInput.value = row.sortkey
        }
      })
    }
  })
  const infoBtn = h(
    'button',
    {
      class: 'ipe-quick-cat__ds-info',
      type: 'button',
      'aria-label': i18n('defaultSort'),
      onClick: () => {
        getDefaultSortHelp(ctx).then((content) => {
          if (m.isDestroyed) return
          ctx.modal.notify('info', {
            title: i18n('defaultSort'),
            content,
            closeAfter: 8000,
          })
        })
      },
    },
    createInfoIcon()
  )
  const dsLabel = h(
    'label',
    { class: 'ipe-quick-cat__ds' },
    h('span', { class: 'ipe-quick-cat__ds-text' }, i18n('defaultSort')),
    infoBtn,
    dsInput
  )

  const summaryInput = h('input', {
    id: 'ipe-quick-cat__summary',
    class: 'ipe-quick-cat__summary-input',
    type: 'text',
    value: state.summary || '',
    placeholder: i18n('summaryPh'),
  }) as HTMLInputElement
  summaryInput.addEventListener('input', () => {
    state.summary = summaryInput.value.trim()
  })
  const minorCheck = h('input', { type: 'checkbox', checked: state.minor }) as HTMLInputElement
  minorCheck.addEventListener('change', () => {
    state.minor = minorCheck.checked
  })
  const reloadCheck = h('input', { type: 'checkbox', checked: state.reloadAfterSave }) as HTMLInputElement
  reloadCheck.addEventListener('change', () => {
    state.reloadAfterSave = reloadCheck.checked
  })

  const options = h(
    'div',
    { class: 'ipe-quick-cat__options' },
    h(
      'div',
      { class: 'ipe-quick-cat__summary-wrap' },
      h('label', { class: 'ipe-quick-cat__summary-label', for: 'ipe-quick-cat__summary' }, i18n('summaryLabel')),
      summaryInput
    ),
    h(
      'div',
      { class: 'ipe-quick-cat__options-row' },
      h('label', { class: 'ipe-quick-cat__checkbox' }, minorCheck, h('span', {}, i18n('minorEdit'))),
      h('label', { class: 'ipe-quick-cat__checkbox' }, reloadCheck, h('span', {}, i18n('reloadAfterSave')))
    )
  )

  root.append(toolbar, list, addBar, dsLabel, options)
  m.setContent(root)
}

async function saveCategories(ctx: Ctx, m: any, state: CategoryState | null): Promise<void> {
  if (!state) return
  const { modal } = ctx

  const bad = state.rows.find((r) => !r.name || /[\[\]|#<>{}]/.test(r.name))
  if (bad) {
    modal.notify('error', { title: i18n('invalidTitle'), content: i18n('invalidTitleDesc') })
    return
  }

  if (isUnchanged(state)) {
    modal.notify('info', { title: i18n('noChange') })
    return
  }

  const newText = buildWikitext(state.content, state.rows, state.defaultSort, state.categories)
  m.setLoadingState(true)
  try {
    await state.page.edit({
      text: newText,
      summary: state.summary || i18n('summaryDefault'),
      minor: state.minor,
      // Precise conflict detection, but only for existing pages (lastrevid > 0);
      // new/red-link pages would otherwise send baserevid: 0 and fail with nosuchrevid
      ...(state.page.lastrevid > 0 ? { baserevid: state.page.lastrevid } : {}),
    })
    if (!m.isDestroyed) m.close()
    if (state.reloadAfterSave) {
      modal.notify('success', {
        title: i18n('saved'),
        content: i18n('savedDesc'),
        closeAfter: 900,
      })
      setTimeout(() => window.location.reload(), 1000)
    } else {
      modal.notify('success', {
        title: i18n('saved'),
        content: i18n('savedDesc'),
        closeAfter: 3000,
      })
    }
  } catch (err) {
    log.error('save failed:', err)
    const code = (err as any)?.code || (err as any)?.data?.error?.code
    if (code === 'pagedeleted' || code === 'editconflict') {
      modal.notify('warning', {
        title: i18n('submissionError'),
        content: h(
          'div',
          {},
          h('p', {}, h('strong', {}, String((err as Error)?.message || err))),
          h('p', {}, i18n('reopenToRetry'))
        ),
        closeAfter: 15000,
      })
      return
    }
    modal.notify('error', { title: i18n('submissionError'), content: String((err as Error)?.message || err) })
  } finally {
    if (!m.isDestroyed) m.setLoadingState(false)
  }
}

async function showModal(ctx: Ctx): Promise<any> {
  const { modal } = ctx
  const title =
    ctx.currentPage?.wikiTitle?.getPrefixedText?.() ||
    ((mw.config.get('wgPageName') as string) || '').replace(/_/g, ' ')
  if (!title) {
    modal.notify('warning', { title: i18n('modalTitle'), content: i18n('notEditable') })
    return
  }

  const [summaryVal, minorVal, closeVal] = await Promise.all([
    ctx.preferences.get('quickCat.defaultSummary'),
    ctx.preferences.get('quickCat.defaultMinor'),
    ctx.preferences.get('quickCat.outSideClose'),
  ])
  const defaultSummary = String(summaryVal ?? '')
  const defaultMinor = !!minorVal
  const outSideClose = !!closeVal

  const m = modal
    .createObject({
      title: `${i18n('modalTitle')}: ${title}`,
      content: h('div', { class: 'ipe-quick-cat ipe-quick-cat--loading' }, i18n('loading')),
      // className lands on the modal window: keep only compact-buttons there;
      // plugin styles live on the content root (.ipe-quick-cat)
      className: 'compact-buttons',
      sizeClass: 'smallToMedium',
      center: true,
      outSideClose,
    })
    .init()

  {
    const titleFrag = document.createDocumentFragment()
    titleFrag.append(document.createTextNode(`${i18n('modalTitle')}: `))
    titleFrag.append(h('u', {}, title))
    m.setTitle(titleFrag)
  }

  let state: CategoryState | null = null

  m.addButton({
    side: 'right',
    type: 'button',
    className: 'is-danger is-ghost',
    label: i18n('cancel'),
    method: () => m.close(),
  })
  m.addButton({
    side: 'right',
    type: 'button',
    className: 'is-primary is-ghost',
    label: i18n('save'),
    method: () => saveCategories(ctx, m, state),
  })

  m.show()
  m.setLoadingState(true)

  try {
    const page = await ctx.wikiPage.newFromTitle(title)
    const content = page.revisions?.[0]?.content ?? ''
    const parsed = parseCategories(content)
    state = {
      title,
      pageName:
        ctx.currentPage?.wikiTitle?.getPrefixedText?.() ||
        ((mw.config.get('wgPageName') as string) || title).replace(/_/g, ' '),
      page,
      content,
      categories: parsed.categories,
      originalDefaultSort: parsed.defaultSort,
      defaultSort: parsed.defaultSort,
      summary: defaultSummary,
      minor: defaultMinor,
      reloadAfterSave: true,
      selected: new Set(),
      _dragIndex: null,
      rows: parsed.categories.map((c) => ({
        _id: c._id,
        name: c.name,
        sortkey: c.sortkey || parsed.defaultSort,
        ns: c.ns || null,
      })),
    }
    renderDialog(ctx, m, state)
  } catch (err) {
    log.error('load failed:', err)
    m.setContent(
      h(
        'div',
        { class: 'ipe-quick-cat ipe-quick-cat--error' },
        h('p', {}, i18n('loadFailed')),
        h('p', { class: 'ipe-quick-cat__errmsg' }, String((err as Error)?.message || err))
      )
    )
    modal.notify('error', { title: i18n('loadFailed'), content: String((err as Error)?.message || err) })
  } finally {
    if (!m.isDestroyed) m.setLoadingState(false)
  }

  return m
}

export default defineIPEPlugin({
  name: PLUGIN_NAME,
  inject: ['toolbox', 'modal', 'wikiPage', 'api'],
  apply(ctx: InPageEdit): void {
    const c = ctx as Ctx
    // Prevent duplicate registration (plugin store + userscript both load)
    if ((c as any)[APPLIED_FLAG]) return
    ;(c as any)[APPLIED_FLAG] = true
    _logger = (c as any).logger?.('quick-cat') ?? null

    // Preferences UI via the custom config registry (reliable for store-installed plugins)
    c.preferences?.registerCustomConfig?.(
      PLUGIN_NAME,
      Schema.object({
        'quickCat.defaultSummary': Schema.string()
          .description('Default summary of the quick cat')
          .default('[IPE-NEXT] Quick Cat'),
        'quickCat.defaultMinor': Schema.boolean()
          .description('Default to checking "minor edit" option')
          .default(false),
        'quickCat.outSideClose': Schema.boolean()
          .description('Close editor modal by clicking outside')
          .default(false),
      }).description('Quick Cat options'),
      'general'
    )

    currentCtx = c
    c.on('dispose', () => {
      if (currentCtx === c) currentCtx = null
      _logger = null
    })

    let action = 'view'
    try {
      const pageAction = c.currentPage?.wikiAction
      action =
        (typeof pageAction === 'string' && pageAction) || (mw.config.get('wgAction') as string) || 'view'
    } catch {
      /* ignore */
    }
    const editable = !!mw.config.get('wgIsProbablyEditable')
    const canEdit = editable && action === 'view'

    c.toolbox.addButton({
      id: PLUGIN_NAME,
      group: 'group2',
      index: 0,
      icon: createTagIcon(),
      tooltip: () => (canEdit ? i18n('tooltip') : i18n('tooltipNotEditable')),
      // Disabled: grey out instead of hiding
      buttonProps: canEdit
        ? undefined
        : { style: { cursor: 'not-allowed', filter: 'grayscale(50%) opacity(.75)' } },
      onClick: (e: Event) => {
        e.preventDefault()
        if (!canEdit) return
        void showModal(c)
      },
    })
    c.on('dispose', () => {
      c.toolbox.removeButton(PLUGIN_NAME)
    })
  },
})
