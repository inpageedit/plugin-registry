import { initCategoryNsInfo } from './parse.js'
import type { Ctx, QuickCatContext, QuickCatLogger } from './types.js'

export const PLUGIN_NAME = 'quick-cat'

// Resolve the effective IPE language: the 'language' preference may be
// '@user' (MediaWiki user language), '@site' (wiki content language) or a code
async function resolveLanguage(ctx: Ctx): Promise<string> {
  let code: unknown
  try {
    code = await ctx.preferences?.get?.('language')
  } catch {
    /* ignore */
  }
  const fromConfig = (key: string) => {
    try {
      return String((mw.config.get(key) as string) || '')
    } catch {
      return ''
    }
  }
  if (code === '@site') return fromConfig('wgContentLanguage') || 'en'
  if (!code || code === '@user') return fromConfig('wgUserLanguage') || 'en'
  return String(code) || 'en'
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
  tooltipNotEditable: 'Not editable',
  saved: 'Your changes have been saved.',
  summaryLabel: 'Summary',
  submissionError: 'Submission Error',
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

  // Effective language: start from wgUserLanguage, then follow the IPE
  // 'language' preference (incl. hot-switch on the i18n/changed event)
  let lang = 'en'
  const setLang = (l: string) => {
    if (l) lang = l
  }
  void resolveLanguage(ctx).then(setLang)
  ctx.on?.('i18n/changed', () => {
    void resolveLanguage(ctx).then(setLang)
  })

  // Lightweight i18n: reuse the official dict when possible, else built-in zh/en
  const t = (key: string, ...args: (string | number)[]): string => {
    const interpolateMsg = (msg: string) =>
      args.length
        ? msg.replace(/\{\{\s*\$(\d+)\s*\}\}/g, (_, i) => String(args[Number(i) - 1] ?? ''))
        : msg

    const official = OFFICIAL_KEYS[key]
    if (official && ctx.$$) {
      try {
        // Call the $$ tag function with a synthetic template
        const ts = Object.assign([official], { raw: [official] }) as unknown as TemplateStringsArray
        const officialMsg = ctx.$$(ts)
        if (officialMsg && officialMsg !== `(${official})`) {
          return interpolateMsg(officialMsg)
        }
      } catch {
        /* fallback to built-in dict */
      }
    }

    const table = String(lang).toLowerCase().startsWith('zh') ? I18N.zh : I18N.en
    return interpolateMsg(table[key] ?? I18N.en[key] ?? key)
  }

  return { ctx, logger, nsInfo, lang, suggestSeq: 0, optSeq: 0, t }
}
