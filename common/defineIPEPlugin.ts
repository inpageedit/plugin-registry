import type { Inject, InPageEdit, Schema } from '@inpageedit/core'
import { promiseWithResolvers } from './Promise.withResolvers'

export interface IPEPlugin {
  name: string
  inject?: Inject
  apply: (ctx: InPageEdit) => Promise<void> | void
  [k: string]: any
}

export const defineIPEPlugin = (plugin: IPEPlugin): IPEPlugin => {
  return plugin
}

export class BasePlugin<K extends unknown = any> {
  public name: string
  public config: K
  /** 依赖注入 */
  static inject?: Inject = []
  /** 可重用？ */
  static reusable = false
  /** 插件的偏好设置模式 */
  static PreferencesSchema?: Schema

  constructor(
    public ctx: InPageEdit,
    config: K = undefined as unknown as K,
    name?: string
  ) {
    this.name = name || ''
    this.config = config || ({} as K)
    const { promise, resolve, reject } = promiseWithResolvers<void>()
    queueMicrotask(() => {
      if (!this.name) {
        this.name = this.constructor.name
      }
      try {
        const ret = this.start()
        if (ret && typeof (ret as Promise<unknown>).then === 'function') {
          ;(ret as Promise<unknown>)
            .then(() => resolve())
            .catch((err) => {
              this.logger.error('start() returns a rejected promise', err)
              reject(err)
            })
        } else {
          resolve()
        }
      } catch (err) {
        this.logger.error('start() threw synchronously', err)
        reject(err)
      }

      promise.then(() => {
        this.logger.debug('started')
      })
      promise.catch((e) => {
        this.logger.error('start failed', e)
        this.ctx.scope.dispose()
      })
    })
    this.ctx.once('dispose', () => {
      this.stop()
      this.logger.debug('disposed')
    })
  }

  protected start(): Promise<void> | void {}
  protected stop(): Promise<void> | void {}

  get logger() {
    return this.ctx.logger(this.name)
  }
  get Schema() {
    return this.ctx.schema
  }
}
