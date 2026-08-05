import { initCategoryNsInfo } from './parse.js'
import type { Ctx, QuickCatContext, QuickCatLogger } from './types.js'

export const PLUGIN_NAME = 'quick-cat'

// quick-cat.* messages. IPE resolves language by exact variant code (no
// aliasing), so ZH_SIMP covers every Simplified variant and ZH_TRAD reuses it.
const ZH_SIMP: Record<string, string> = {
  tooltip: '快速分类',
  modalTitle: '快速分类',
  addPh: '输入分类名以添加',
  namePh: '分类名',
  sortKeyPh: '排序键（可选）',
  drag: '拖动排序',
  selectAll: '全选',
  selectedCount: '已选 {{ $1 }} 项',
  deleteSelected: '删除所选',
  defaultSort: '默认排序键',
  noCategories: '此页面没有直接书写的分类。',
  loadFailed: '分类加载失败',
  invalidTitle: '分类名无效',
  invalidTitleDesc: '分类名不能为空，且不能包含 [ ] | # < > { } 等字符。',
  duplicate: '该分类已存在',
  savedDesc: '页面分类已成功更新。',
}
// Traditional Chinese falls back to the Simplified set for now
const ZH_TRAD = ZH_SIMP
const EN: Record<string, string> = {
  tooltip: 'Quick Cat',
  modalTitle: 'Quick Cat',
  addPh: 'Type a category to add',
  namePh: 'Category name',
  sortKeyPh: 'Sort key (optional)',
  drag: 'Drag to reorder',
  selectAll: 'Select all',
  selectedCount: '{{ $1 }} selected',
  deleteSelected: 'Delete selected',
  defaultSort: 'Default sort key',
  noCategories: 'This page has no directly written categories.',
  loadFailed: 'Failed to load categories',
  invalidTitle: 'Invalid category name',
  invalidTitleDesc: 'Category names cannot be empty or contain [ ] | # < > { }.',
  duplicate: 'Category already exists',
  savedDesc: 'Page categories have been updated.',
}

const MESSAGES: Record<string, Record<string, string>> = {
  'zh-hans': ZH_SIMP,
  'zh-cn': ZH_SIMP,
  'zh-sg': ZH_SIMP,
  'zh-my': ZH_SIMP,
  zh: ZH_SIMP,
  'zh-hant': ZH_TRAD,
  'zh-tw': ZH_TRAD,
  'zh-hk': ZH_TRAD,
  'zh-mo': ZH_TRAD,
  en: EN,
}

// Official messages via ctx.$$ (follow all IPE languages); rest use quick-cat.*
const OFFICIAL_KEYS: Record<string, string> = {
  cancel: 'Cancel',
  save: 'Save',
  add: 'Add',
  remove: 'Remove',
  minorEdit: 'Minor edit',
  reloadAfterSave: 'Reload after save',
  noChange: 'No changes',
  notEditable: 'Not editable',
  tooltipNotEditable: 'Not editable',
  saved: 'Your changes have been saved.',
  summaryLabel: 'Summary',
  submissionError: 'Submission Error',
  retry: 'You can try to submit again to dismiss the warnings.',
}

// Per-plugin context factory: routes logging + i18n through ctx, holds nsInfo
export function createQuickCatContext(ctx: Ctx): QuickCatContext {
  const logger: QuickCatLogger = (() => {
    const fw = (ctx as any).logger?.(PLUGIN_NAME)
    if (fw) return fw
    return {
      info: (...args: unknown[]) => console.info('[IPE-QuickCat]', ...args),
      warn: (...args: unknown[]) => console.warn('[IPE-QuickCat]', ...args),
      error: (...args: unknown[]) => console.error('[IPE-QuickCat]', ...args),
    }
  })()

  const nsInfo = initCategoryNsInfo()

  // Register messages (registerMessages sets data synchronously)
  const i18n = (ctx as any).i18n
  if (i18n?.registerMessages) {
    for (const [lang, data] of Object.entries(MESSAGES)) {
      i18n.registerMessages(lang, data, { namespace: PLUGIN_NAME })
    }
  }

  const t = (key: string, ...args: (string | number)[]): string => {
    // Official messages reuse IPE's dict (follow every IPE language); the rest
    // live under the 'quick-cat' namespace (registered via registerMessages)
    const msgKey = OFFICIAL_KEYS[key] ?? `${PLUGIN_NAME}.${key}`
    if (ctx.$$) {
      try {
        const msg = ctx.$$(...args)`${msgKey}`
        if (msg && !msg.startsWith('(')) return msg
      } catch {
        /* fall through */
      }
    }
    // Built-in English fallback (standalone/dev contexts without i18n)
    return MESSAGES.en[key] ?? OFFICIAL_KEYS[key] ?? key
  }

  return { ctx, logger, nsInfo, suggestSeq: 0, optSeq: 0, t }
}
