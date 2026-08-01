import type {
  CurrentPageService,
  InPageEdit,
  PreferencesService,
  WikiPageService,
} from '@inpageedit/core'
import type { CategoryNsInfo } from './parse.js'

export type Ctx = InPageEdit & {
  $$: (strings: TemplateStringsArray, ...args: unknown[]) => string
  api: any // MwApi instance (wiki-saikou); no stable re-export from core
  currentPage?: CurrentPageService
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
  lang: string
  suggestSeq: number
  optSeq: number
  t: (key: string, ...args: (string | number)[]) => string
}
