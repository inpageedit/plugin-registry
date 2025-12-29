import type { InPageEdit, IPEModal, IWikiPage } from '@inpageedit/core'
import { BasePlugin } from '~~/defineIPEPlugin.js'
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
    'quick-delete/delete-one'(
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
  deletetalk?: boolean
}

const createAbortError = () => {
  // In browsers this is usually DOMException('AbortError'); use Error as a fallback for unified handling.
  const err = new Error('Aborted')
  ;(err as any).name = 'AbortError'
  return err
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const sleepWithAbort = (ms: number, signal?: AbortSignal) => {
  if (!signal) return sleep(ms)
  if (signal.aborted) return Promise.reject(createAbortError())
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    const onAbort = () => {
      clearTimeout(timer)
      signal.removeEventListener('abort', onAbort)
      reject(createAbortError())
    }
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

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
    this.ctx.inject(['analytics'], (ctx) => {
      ctx.on('quick-delete/delete-one', (payload) => {
        ctx.analytics.addEvent(
          'quick-delete',
          'delete-one',
          payload.wikiPage.title
        )
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
    this.ctx.emit('quick-delete/init-options', {
      ctx: this.ctx,
      options: payload as QuickDeleteOptions,
    })

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
          const succeeded: string[] = []
          const failed: { title: string; error: unknown }[] = []
          let abortRequested = false

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
                  abortRequested = true
                  abortController.abort()
                },
              },
            ],
          })
          const [progressText, setProgressText] = useText('0')
          const [currentTitleText, setCurrentTitleText] = useText('-')
          const [successText, setSuccessText] = useText('0')
          const [failedText, setFailedText] = useText('0')
          const [pendingText, setPendingText] = useText(total.toString())
          const [hintText, setHintText] = useText(
            'Cancel will stop subsequent deletions (effective after the current request finishes).'
          )

          const logsUl = (
            <ul style={{ margin: '0.25rem 0 0 1.25rem' }} />
          ) as HTMLUListElement
          const appendLog = (
            kind: 'success' | 'fail' | 'info',
            title: string,
            msg?: string
          ) => {
            const color =
              kind === 'success'
                ? 'var(--ipe-modal-success)'
                : kind === 'fail'
                ? 'var(--ipe-modal-danger)'
                : 'var(--ipe-modal-text-secondary)'
            const li = (
              <li>
                <span style={{ color }}>
                  {kind === 'success' ? '✔ ' : kind === 'fail' ? '✖ ' : '• '}
                </span>
                <strong>{title}</strong>
                {msg ? <span> — {msg}</span> : null}
              </li>
            ) as HTMLLIElement
            logsUl.appendChild(li)
          }

          overlay.setContent(
            <div
              className="theme-ipe-prose"
              style={{ display: 'grid', gap: '0.75rem' }}
            >
              <div>
                <div>
                  Progress <strong>{progressText}</strong> /{' '}
                  <strong>{total}</strong> (remaining <strong>{pendingText}</strong>)
                </div>
                <div style="margin-top: 0.25rem;">
                  Current: <code>{currentTitleText}</code>
                </div>
                <div style="margin-top: 0.25rem; color: var(--ipe-modal-text-secondary);">
                  {hintText}
                </div>
              </div>
              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <div>
                   Success:{' '}
                  <strong style="color: var(--ipe-modal-success);">
                    {successText}
                  </strong>
                </div>
                <div>
                   Failed:{' '}
                  <strong style="color: var(--ipe-modal-danger);">
                    {failedText}
                  </strong>
                </div>
              </div>
              <div>
                <div style="color: var(--ipe-modal-text-secondary);">
                   Log (appended in time order):
                </div>
                {logsUl}
              </div>
            </div>
          )

          const pending = titles.slice()
          setPendingText(pending.length.toString())

          while (pending.length) {
            const title = pending[0]!
            setCurrentTitleText(title)

            if (abortController.signal.aborted) {
              break
            }

            try {
              await this.deleteOne(title, reason, deleteTalk)
              succeeded.push(title)
              setSuccessText(succeeded.length.toString())
              appendLog('success', title)
            } catch (error) {
              failed.push({ title, error })
              setFailedText(failed.length.toString())
              appendLog('fail', title, (error as any)?.message || String(error))
            } finally {
              pending.shift()
              setProgressText((total - pending.length).toString())
              setPendingText(pending.length.toString())
            }

            if (pending.length) {
              try {
                await sleepWithAbort(1000, abortController.signal)
              } catch (e) {
                // Allow immediate cancel during the delay between requests
                appendLog('info', 'Cancelled', 'Delay interrupted; stopping subsequent deletions.')
                break
              }
            }
          }

          const unprocessed = pending.slice()

          // Auto-refill "failed + unprocessed" titles back into the input for quick retry
          const refill = Array.from(
            new Set([...failed.map((x) => x.title), ...unprocessed])
          )
          textarea.value = refill.join('\n') + (refill.length ? '\n' : '')

          modal.setLoadingState(false)

          overlay.setTitle('Deletion Result')
          overlay.removeButton('abort-delete-button')

          if (abortRequested) {
            setHintText(
              'Cancelled: subsequent deletions stopped (effective after the current request finishes).'
            )
          }

          overlay.setContent(
            <div
              className="theme-ipe-prose"
              style={{ display: 'grid', gap: '0.75rem' }}
            >
              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <div>
                   Deleted:{' '}
                  <strong style="color: var(--ipe-modal-success);">
                    {succeeded.length}
                  </strong>
                </div>
                <div>
                   Failed:{' '}
                  <strong style="color: var(--ipe-modal-danger);">
                    {failed.length}
                  </strong>
                </div>
                <div>
                   Unprocessed:{' '}
                  <strong style="color: var(--ipe-modal-warning);">
                    {unprocessed.length}
                  </strong>
                </div>
              </div>

              {(failed.length || unprocessed.length) && (
                <div style="color: var(--ipe-modal-text-secondary);">
                   Titles for <strong>failed + unprocessed</strong> items have been refilled into the input. Click Delete to retry.
                </div>
              )}

              {failed.length ? (
                <div>
                  <div style="color: var(--ipe-modal-danger);">Failure details:</div>
                  <ul style={{ margin: '0.25rem 0 0 1.25rem' }}>
                    {failed.map(({ title, error }) => (
                      <li key={title}>
                        <strong>{title}</strong>
                        <div style="color: var(--ipe-modal-text-secondary);">
                          {(error as any)?.message || String(error)}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {unprocessed.length ? (
                <div>
                  <div style="color: var(--ipe-modal-warning);">
                    Unprocessed (usually due to cancellation):
                  </div>
                  <ul style={{ margin: '0.25rem 0 0 1.25rem' }}>
                    {unprocessed.map((t) => (
                      <li key={t}>
                        <strong>{t}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
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
    this.ctx.emit('quick-delete/show-modal', {
      ctx: this.ctx,
      modal,
      options: payload as QuickDeleteOptions,
    })

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
    const result = await page.delete(reason, { deletetalk })
    this.ctx.emit('quick-delete/delete-one', {
      ctx: this.ctx,
      wikiPage: page,
      reason,
      deletetalk,
    })
    return result
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
