import type { IWikiPage } from '@inpageedit/core'
import type { CategoryRef, CategoryRow } from './parse.js'

export interface CategoryState {
  title: string
  pageName: string
  defaultSortKey: string
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
  forceSave: boolean
}

// Pure state mutations; the renderer calls these then refreshes the DOM

export function toggleSelection(state: CategoryState, row: CategoryRow, checked: boolean): void {
  if (checked) state.selected.add(row)
  else state.selected.delete(row)
}

export function selectAll(state: CategoryState, on: boolean): void {
  if (on) state.rows.forEach((r) => state.selected.add(r))
  else state.selected.clear()
}

export function removeRow(state: CategoryState, row: CategoryRow): void {
  state.rows = state.rows.filter((r) => r !== row)
  state.selected.delete(row)
}

export function deleteSelected(state: CategoryState): void {
  if (!state.selected.size) return
  state.rows = state.rows.filter((r) => !state.selected.has(r))
  state.selected.clear()
}

export function startDrag(state: CategoryState, row: CategoryRow): void {
  state._dragIndex = state.rows.indexOf(row)
}

export function endDrag(state: CategoryState): void {
  state._dragIndex = null
}

export function reorderRow(state: CategoryState, toIndex: number): void {
  if (state._dragIndex == null) return
  const from = state._dragIndex
  const [moved] = state.rows.splice(from, 1)
  const target = from < toIndex ? toIndex - 1 : toIndex
  state.rows.splice(target, 0, moved)
  state._dragIndex = null
}
