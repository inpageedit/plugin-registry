import './style.scss'

import { Schema, type InPageEdit } from '@inpageedit/core'

import { defineIPEPlugin } from '~~/defineIPEPlugin.js'
import {
  buildWikitext,
  isUnchanged,
  parseCategories,
  stripCategoryPrefix,
  type CategoryRow,
} from './parse.js'
import { PLUGIN_NAME, createQuickCatContext } from './context.js'
import { createInfoIcon, createTagIcon, h } from './dom.js'
import { attachAutocomplete } from './autocomplete.js'
import {
  deleteSelected,
  endDrag,
  reorderRow,
  removeRow,
  selectAll,
  startDrag,
  toggleSelection,
  type CategoryState,
} from './categoryState.js'
import type { Ctx, QuickCatContext } from './types.js'

const APPLIED_FLAG = Symbol.for('ipe-quick-cat.applied')

let _defaultSortHelpCache: string | null = null

// Fetch the default-sort help: API (allmessages) first, then mw.msg, then built-in
async function getDefaultSortHelp(qc: QuickCatContext): Promise<string> {
  const { ctx, logger } = qc
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
      logger.info('default sort help resolved via API (lang=' + lang + ')')
      return text
    }
    logger.warn('default sort help: API returned no message (lang=' + lang + ')')
  } catch (e) {
    logger.warn('getDefaultSortHelp api failed:', e)
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
  logger.warn('default sort help: fell back to built-in English')
  return _defaultSortHelpCache
}

function createCategoryRow(
  qc: QuickCatContext,
  m: any,
  state: CategoryState,
  row: CategoryRow,
  refreshList: () => void,
  refreshToolbar: () => void
): HTMLElement {
  const { t } = qc
  const rowEl = h('div', { class: 'ipe-quick-cat__row' })

  const check = h('input', {
    class: 'ipe-quick-cat__check',
    type: 'checkbox',
    checked: state.selected.has(row),
  }) as HTMLInputElement
  check.addEventListener('change', () => {
    toggleSelection(state, row, check.checked)
    refreshToolbar()
  })

  const grip = h(
    'span',
    { class: 'ipe-quick-cat__grip', title: t('drag'), 'aria-label': t('drag') },
    '⠿'
  )
  // Pointer events drive the drag on both mouse and touch (HTML5 DnD has no touch support)
  grip.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.preventDefault()
    startDrag(state, row)
    grip.setPointerCapture(e.pointerId)
    rowEl.classList.add('is-dragging')
  })

  const nameInput = h('input', {
    class: 'ipe-quick-cat__name',
    type: 'text',
    value: row.name,
    placeholder: t('namePh'),
    spellcheck: 'false',
    autocomplete: 'off',
  }) as HTMLInputElement
  nameInput.addEventListener('input', () => {
    row.name = nameInput.value.trim()
  })
  const nameSuggest = h('div', { class: 'ipe-quick-cat__suggest' })
  attachAutocomplete(qc, m, nameInput, nameSuggest, {
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
    placeholder: t('sortKeyPh'),
  }) as HTMLInputElement
  sortInput.addEventListener('input', () => {
    row.sortkey = sortInput.value.trim()
  })

  const removeBtn = h(
    'button',
    {
      class: 'ipe-quick-cat__remove',
      type: 'button',
      title: t('remove'),
      'aria-label': t('remove'),
      onClick: () => {
        removeRow(state, row)
        refreshList()
        refreshToolbar()
      },
    },
    '✕'
  )

  rowEl.append(check, grip, nameWrap, sortInput, removeBtn)
  return rowEl
}

function createAddBar(qc: QuickCatContext, m: any, state: CategoryState, refreshList: () => void): HTMLElement {
  const { t } = qc
  const input = h('input', {
    class: 'ipe-quick-cat__new',
    type: 'text',
    placeholder: t('addPh'),
    autocomplete: 'off',
    spellcheck: 'false',
  }) as HTMLInputElement
  const suggest = h('div', { class: 'ipe-quick-cat__suggest' })
  const addBtn = h('button', { class: 'ipe-quick-cat__addbtn', type: 'button' }, t('add'))

  const doAdd = () => {
    const raw = stripCategoryPrefix(input.value, qc.nsInfo)
    if (!raw) return
    const duplicate = state.rows.some((r) => r.name.toLowerCase() === raw.toLowerCase())
    if (duplicate) {
      qc.ctx.modal.notify('warning', { title: t('duplicate'), content: `Category: ${raw}` })
      return
    }
    state.rows.push({ name: raw, sortkey: state.defaultSort, ns: null })
    input.value = ''
    suggest.textContent = ''
    refreshList()
    input.focus()
  }

  attachAutocomplete(qc, m, input, suggest, { onEnter: doAdd })
  addBtn.addEventListener('click', doAdd)

  return h('div', { class: 'ipe-quick-cat__add' }, input, addBtn, suggest)
}

function renderDialog(qc: QuickCatContext, m: any, state: CategoryState): void {
  const { t } = qc
  const root = h('div', { class: 'ipe-quick-cat' })

  const checkAll = h('input', { class: 'ipe-quick-cat__checkall', type: 'checkbox' }) as HTMLInputElement
  const countEl = h('span', { class: 'ipe-quick-cat__selected-count' }, t('selectedCount', 0))
  const deleteBtn = h(
    'button',
    { class: 'ipe-quick-cat__delete-selected', type: 'button', disabled: true },
    t('deleteSelected')
  ) as HTMLButtonElement

  const refreshToolbar = () => {
    const n = state.rows.length
    const sel = state.selected.size
    checkAll.checked = n > 0 && sel === n
    checkAll.indeterminate = sel > 0 && sel < n
    countEl.textContent = t('selectedCount', sel)
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
    reorderRow(state, computeInsertIndex(e.clientY))
    refreshList()
  })
  list.addEventListener('pointercancel', () => {
    endDrag(state)
    list.querySelectorAll('.ipe-quick-cat__row').forEach((el) =>
      el.classList.remove('is-dragging', 'is-drop-before', 'is-drop-after')
    )
  })

  checkAll.addEventListener('change', () => {
    selectAll(state, checkAll.checked)
    list.querySelectorAll('.ipe-quick-cat__row').forEach((el) => {
      const cb = el.querySelector('.ipe-quick-cat__check') as HTMLInputElement | null
      if (cb) cb.checked = checkAll.checked
    })
    refreshToolbar()
  })
  deleteBtn.addEventListener('click', () => {
    deleteSelected(state)
    refreshList()
    refreshToolbar()
  })

  const toolbar = h(
    'div',
    { class: 'ipe-quick-cat__toolbar' },
    h(
      'label',
      { class: 'ipe-quick-cat__checkbox' },
      checkAll,
      h('span', {}, t('selectAll'))
    ),
    countEl,
    deleteBtn
  )

  const refreshList = () => {
    list.textContent = ''
    if (state.rows.length === 0) {
      list.append(h('div', { class: 'ipe-quick-cat__empty' }, t('noCategories')))
    } else {
      for (const row of state.rows) {
        list.append(createCategoryRow(qc, m, state, row, refreshList, refreshToolbar))
      }
    }
    refreshToolbar()
  }
  refreshList()

  const addBar = createAddBar(qc, m, state, refreshList)

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
      'aria-label': t('defaultSort'),
      onClick: () => {
        getDefaultSortHelp(qc).then((content) => {
          if (m.isDestroyed) return
          qc.ctx.modal.notify('info', {
            title: t('defaultSort'),
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
    h('span', { class: 'ipe-quick-cat__ds-text' }, t('defaultSort')),
    infoBtn,
    dsInput
  )

  const summaryInput = h('input', {
    id: 'ipe-quick-cat__summary',
    class: 'ipe-quick-cat__summary-input',
    type: 'text',
    value: state.summary || '',
    placeholder: t('summaryPh'),
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
      h('label', { class: 'ipe-quick-cat__summary-label', for: 'ipe-quick-cat__summary' }, t('summaryLabel')),
      summaryInput
    ),
    h(
      'div',
      { class: 'ipe-quick-cat__options-row' },
      h('label', { class: 'ipe-quick-cat__checkbox' }, minorCheck, h('span', {}, t('minorEdit'))),
      h('label', { class: 'ipe-quick-cat__checkbox' }, reloadCheck, h('span', {}, t('reloadAfterSave')))
    )
  )

  root.append(toolbar, list, addBar, dsLabel, options)
  m.setContent(root)
}

async function saveCategories(qc: QuickCatContext, m: any, state: CategoryState | null): Promise<void> {
  if (!state) return
  const { modal } = qc.ctx
  const { t, logger, nsInfo } = qc

  const bad = state.rows.find((r) => !r.name || /[\[\]|#<>{}]/.test(r.name))
  if (bad) {
    modal.notify('error', { title: t('invalidTitle'), content: t('invalidTitleDesc') })
    return
  }

  if (isUnchanged(state, nsInfo)) {
    modal.notify('info', { title: t('noChange') })
    return
  }

  const newText = buildWikitext(state.content, state.rows, state.defaultSort, state.categories, nsInfo)
  m.setLoadingState(true)
  try {
    await state.page.edit({
      text: newText,
      summary: state.summary || t('summaryDefault'),
      minor: state.minor,
      // Precise conflict detection, but only for existing pages (lastrevid > 0);
      // new/red-link pages would otherwise send baserevid: 0 and fail with nosuchrevid
      ...(state.page.lastrevid > 0 ? { baserevid: state.page.lastrevid } : {}),
    })
    if (!m.isDestroyed) m.close()
    if (state.reloadAfterSave) {
      modal.notify('success', {
        title: t('saved'),
        content: t('savedDesc'),
        closeAfter: 900,
      })
      setTimeout(() => window.location.reload(), 1000)
    } else {
      modal.notify('success', {
        title: t('saved'),
        content: t('savedDesc'),
        closeAfter: 3000,
      })
    }
  } catch (err) {
    logger.error('save failed:', err)
    const code = (err as any)?.code || (err as any)?.data?.error?.code
    if (code === 'pagedeleted' || code === 'editconflict') {
      modal.notify('warning', {
        title: t('submissionError'),
        content: h(
          'div',
          {},
          h('p', {}, h('strong', {}, String((err as Error)?.message || err))),
          h('p', {}, t('reopenToRetry'))
        ),
        closeAfter: 15000,
      })
      return
    }
    modal.notify('error', { title: t('submissionError'), content: String((err as Error)?.message || err) })
  } finally {
    if (!m.isDestroyed) m.setLoadingState(false)
  }
}

async function showModal(qc: QuickCatContext): Promise<any> {
  const { ctx, logger, t, nsInfo } = qc
  const modal = ctx.modal
  const title =
    ctx.currentPage?.wikiTitle?.getPrefixedText?.() ||
    ((mw.config.get('wgPageName') as string) || '').replace(/_/g, ' ')
  if (!title) {
    modal.notify('warning', { title: t('modalTitle'), content: t('notEditable') })
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
      title: `${t('modalTitle')}: ${title}`,
      content: h('div', { class: 'ipe-quick-cat ipe-quick-cat--loading' }, t('loading')),
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
    titleFrag.append(document.createTextNode(`${t('modalTitle')}: `))
    titleFrag.append(h('u', {}, title))
    m.setTitle(titleFrag)
  }

  let state: CategoryState | null = null

  m.addButton({
    side: 'right',
    type: 'button',
    className: 'is-danger is-ghost',
    label: t('cancel'),
    method: () => m.close(),
  })
  m.addButton({
    side: 'right',
    type: 'button',
    className: 'is-primary is-ghost',
    label: t('save'),
    method: () => saveCategories(qc, m, state),
  })

  m.show()
  m.setLoadingState(true)

  try {
    const page = await ctx.wikiPage.newFromTitle(title)
    const content = page.revisions?.[0]?.content ?? ''
    const parsed = parseCategories(content, nsInfo)
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
    renderDialog(qc, m, state)
  } catch (err) {
    logger.error('load failed:', err)
    m.setContent(
      h(
        'div',
        { class: 'ipe-quick-cat ipe-quick-cat--error' },
        h('p', {}, t('loadFailed')),
        h('p', { class: 'ipe-quick-cat__errmsg' }, String((err as Error)?.message || err))
      )
    )
    modal.notify('error', { title: t('loadFailed'), content: String((err as Error)?.message || err) })
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
    const qc = createQuickCatContext(c)

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
      tooltip: () => (canEdit ? qc.t('tooltip') : qc.t('tooltipNotEditable')),
      // Disabled: grey out instead of hiding
      buttonProps: canEdit
        ? undefined
        : { style: { cursor: 'not-allowed', filter: 'grayscale(50%) opacity(.75)' } },
      onClick: (e: Event) => {
        e.preventDefault()
        if (!canEdit) return
        void showModal(qc)
      },
    })
    c.on('dispose', () => {
      c.toolbox.removeButton(PLUGIN_NAME)
    })
  },
})
