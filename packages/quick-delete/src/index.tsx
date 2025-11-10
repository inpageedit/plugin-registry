import { type InPageEdit } from '@inpageedit/core'
import { IPEModal } from '@inpageedit/core/services/ModalService'
import { IWikiPage } from '@inpageedit/core/dist/models/WikiPage/index.js'
// import * as React from 'jsx-dom'
import { BasePlugin } from '~~/defineIPEPlugin.js'
import type {} from '@inpageedit/core/plugins/toolbox/index'
import type {} from '@inpageedit/core/services/ApiService'
import type {} from '@inpageedit/core/services/CurrentPageService'
import type {} from '@inpageedit/core/services/WikiMetadataService'
import type {} from '@inpageedit/core/services/WikiPageService'
import type {} from '@inpageedit/core/services/PreferencesService'
import { useText } from 'jsx-dom'

declare module '@inpageedit/core' {
  interface InPageEdit {
    quickDelete: PluginQuickDelete
  }
  interface Events {
    'quick-delete/init-options'(
      payload: Omit<QuickDeleteInitPayload, 'modal' | 'wikiPage'>
    ): void
    'quick-delete/show-modal'(
      payload: Omit<QuickDeleteInitPayload, 'wikiPage'>
    ): void
    'quick-delete/submit'(
      payload: QuickDeleteSubmitPayload & { ctx: InPageEdit }
    ): void
  }
  interface PreferencesMap {
    'quickDelete.reason': string
  }
}

export interface QuickDeleteOptions {
  titles: string[]
  deleteReason: string
}

export interface QuickDeleteInitPayload {
  ctx: InPageEdit
  options: QuickDeleteOptions
  modal: IPEModal
  wikiPage: IWikiPage
}

export interface QuickDeleteSubmitPayload {
  wikiPage: IWikiPage
  reason?: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class PluginQuickDelete extends BasePlugin {
  static using = [
    'api',
    'currentPage',
    'wiki',
    'wikiPage',
    'modal',
    'preferences',
  ]

  constructor(public ctx: InPageEdit) {
    super(ctx, {}, 'quick-delete')
    ctx.set('quickDelete', this)
  }

  protected start(): Promise<void> | void {
    this.ctx.inject(['toolbox'], (ctx) => {
      this.injectToolbox(ctx)
      ctx.on('dispose', () => {
        this.removeToolbox(ctx)
      })
    })

    const Schema = this.ctx.schema
    this.ctx.preferences.registerCustomConfig(
      'quick-delete',
      Schema.object({
        'quickDelete.reason': Schema.string()
          .description('Default delete reason for quick delete')
          .default('[IPE-NEXT] Quick delete'),
      })
        .description('Quick delete options')
        // @ts-ignore
        .extra('category', 'editor'),
      'editor'
    )
  }

  protected stop(): Promise<void> | void {
    if (this._modal) {
      this._modal.close()
    }
  }

  private _modal: IPEModal | null = null
  async showModal(payload?: Partial<QuickDeleteOptions>) {
    if (this._modal) {
      this._modal.close()
    }
    payload = {
      titles: [],
      deleteReason:
        (await this.ctx.preferences.get('quickDelete.reason')) || '',
      reloadAfterDelete: true,
      ...payload,
    } as QuickDeleteOptions

    const modal = this.ctx.modal.show({
      title: 'Batch Delete',
      sizeClass: 'dialog',
    })

    const textarea = (
      <textarea
        name="titles"
        id="titles"
        rows={10}
        placeholder="Enter the titles of the pages you want to delete, one per line."
      >
        {payload.titles!.join('\n')}
        {'\n'}
      </textarea>
    ) as HTMLTextAreaElement
    const form = (
      <form
        className="ipe-quickDelete-modal"
        style={{ display: 'grid', gap: '1rem' }}
      >
        <div className="ipe-input-box">
          <label htmlFor="titles">
            Enter the titles of the pages you want to delete, one per line.
          </label>
          {textarea}
        </div>
        <div className="ipe-input-box">
          <label htmlFor="reason">Reason</label>
          <input
            type="text"
            name="reason"
            id="reason"
            value={payload.deleteReason}
            placeholder="Enter the reason for deletion."
          />
        </div>
        <div className="ipe-input-box">
          <label className="ipe-checkbox">
            <input type="checkbox" id="deletetalk" name="deletetalk" />
            <span className="ipe-checkbox-box"></span>
            <span>Delete talk pages, if exists</span>
          </label>
        </div>
      </form>
    ) as HTMLFormElement

    modal.setContent(form)

    modal.setButtons([
      {
        label: 'Cancel',
        method: () => {
          modal.close()
        },
      },
      {
        label: 'Delete',
        className: 'is-danger',
        method: async () => {
          const formData = new FormData(form)
          const titlesInput = formData.get('titles') as string
          const reason = formData.get('reason') as string
          const deleteTalk = formData.get('deletetalk') === 'on'
          const titles = Array.from(
            new Set(
              titlesInput
                .split('\n')
                .map((title) => title.trim())
                .filter(Boolean)
            )
          )
          textarea.value = titles.join('\n') + '\n'

          const total = titles.length

          if (total === 0) {
            return
          }

          modal.setLoadingState(true)

          const abortController = new AbortController()
          const errors: {
            title: string
            error: Error
          }[] = []

          const overlay = this.ctx.modal.show({
            title: 'Deleting...',
            closeIcon: false,
            outSideClose: false,
            sizeClass: 'dialog',
            buttons: [
              {
                id: 'abort-delete-button',
                label: 'Cancel',
                className: 'is-danger is-text',
                method: () => {
                  abortController.abort()
                },
              },
            ],
          })
          const [progressText, setProgressText] = useText('0')
          overlay.setContent(
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '4rem',
              }}
            >
              <span>
                Deleting {progressText} of {titles.length} pages...
              </span>
            </div>
          )

          for (const title of titles) {
            if (abortController.signal.aborted) {
              break
            }
            try {
              await this.deleteOne(title, reason, deleteTalk)
            } catch (error) {
              errors.push({ title, error: error as Error })
            }
            titles.shift()
            setProgressText((total - titles.length).toString())
            if (titles.length) {
              await sleep(1000)
            }
          }

          modal.setLoadingState(false)
          textarea.value = titles.join('\n') + '\n'

          overlay.setTitle('Deletion Result')
          overlay.removeButton('abort-delete-button')
          overlay.setContent(
            <div className="theme-ipe-prose">
              <p style="color: var(--ipe-modal-success);">
                Deleted {total - errors.length} pages.
              </p>
              {titles.length && (
                <p style="color: var(--ipe-modal-warning);">
                  Skipped {titles.length} pages.
                </p>
              )}
              {errors.length && (
                <div>
                  <p style="color: var(--ipe-modal-danger);">
                    Failed to delete {errors.length} pages:
                  </p>
                  <ul>
                    {errors.map(({ title, error }) => (
                      <li key={title}>
                        <div>
                          <strong>{title}</strong>
                        </div>
                        <div>{error.message}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
          overlay.setButtons([
            {
              label: 'OK',
              className: 'is-primary',
              method: () => {
                overlay.close()
              },
            },
          ])
        },
      },
    ])

    this._modal = modal
    modal.on(modal.Event.Close, () => {
      this._modal = null
    })
    return modal
  }

  async deleteOne(
    title: string,
    reason: string,
    deletetalk: boolean
  ): Promise<Awaited<ReturnType<IWikiPage['delete']>>> {
    const page = this.ctx.wikiPage.newBlankPage({ title })
    return page.delete(reason, { deletetalk })
  }

  private async injectToolbox(ctx: InPageEdit) {
    const title = this.ctx.currentPage.wikiTitle
    const userHasRight = this.ctx.wiki.hasRight('delete')
    const pageCanDelete = title && title.getNamespaceId() >= 0
    ctx.toolbox.addButton({
      id: 'quick-delete',
      group: 'group2',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 7l16 0" />
          <path d="M10 11l0 6" />
          <path d="M14 11l0 6" />
          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
      ) as HTMLElement,
      buttonProps: {
        disabled: !userHasRight,
      },
      tooltip: userHasRight ? 'Batch Delete' : 'No permission',
      onClick: () => {
        this.showModal({
          titles: title && pageCanDelete ? [title.getPrefixedText()] : [],
        })
      },
    })
  }

  protected removeToolbox(ctx: InPageEdit) {
    ctx.toolbox.removeButton('quick-delete')
  }
}

const _devMode = async (plugin: typeof PluginQuickDelete) => {
  if ((window as any).__ipe_plugin_quickdelete) {
    await (window as any).__ipe_plugin_quickdelete.dispose()
  }
  if (window.ipe) {
    ;(window as any).__ipe_plugin_quickdelete = ipe.plugin(plugin)
  }
}

if (import.meta.env.DEV) {
  _devMode(PluginQuickDelete)
}

if (import.meta.hot) {
  import.meta.hot.accept((module) => {
    _devMode(module?.PluginQuickDelete as typeof PluginQuickDelete)
  })
}
