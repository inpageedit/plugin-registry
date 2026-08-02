import type {
  CurrentPageService,
  InPageEdit,
  PreferencesService,
  WikiPageService,
} from '@inpageedit/core'
import type { CategoryNsInfo } from './parse.js'

// i18n `$$` is a template-tag function: ctx.$$`key` or ctx.$$(params)`key`
export type I18nTagFunction = {
  (strings: TemplateStringsArray, ...values: unknown[]): string
  (...params: unknown[]): (strings: TemplateStringsArray, ...values: unknown[]) => string
}

export type Ctx = InPageEdit & {
  $$: I18nTagFunction
  api: any // MwApi instance (wiki-saikou); no stable re-export from core
  currentPage?: CurrentPageService
  i18n: any // I18nService; its types are not re-exported by @inpageedit/core
  modal: any // ModalService; the modal instance API is chained (createObject().init())
  wikiPage: WikiPageService
  preferences: PreferencesService
  toolbox: any
}

export interface QuickCatLogger {
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
}

// Per-plugin context: replaces module-level singletons (currentCtx/_logger/seqs)
export interface QuickCatContext {
  ctx: Ctx
  logger: QuickCatLogger
  nsInfo: CategoryNsInfo
  suggestSeq: number
  optSeq: number
  t: (key: string, ...args: (string | number)[]) => string
}
