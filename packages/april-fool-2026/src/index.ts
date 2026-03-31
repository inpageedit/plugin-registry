import './style.scss'

import { defineIPEPlugin } from '~~/defineIPEPlugin.js'
import { Terminal } from './terminal/Terminal.js'
import { runBootSequence, showTipForHelp } from './terminal/boot.js'
import { registerAllCommands } from './commands/index.js'

export interface IPETuiPluginContext {
  terminal: Terminal
  command: (name: string, def: any) => void
  open: () => void
  close: () => void
  print: (text: string, style?: string) => void
}

declare module '@inpageedit/core' {
  export interface IPEPluginContext {
    tui: IPETuiPluginContext
  }
}

const STORAGE_KEY_BOOTED = 'ipe-cli-booted'

export default defineIPEPlugin({
  name: 'april-fool-2026',
  inject: ['toolbox'],
  apply(ctx) {
    const terminal = new Terminal(ctx)
    registerAllCommands(terminal)

    // Expose ctx.tui API for third-party plugins
    const tui: IPETuiPluginContext = {
      terminal,
      command: (name: string, def: any) =>
        terminal.registry.register({ name, ...def }),
      open: () => terminal.open(),
      close: () => terminal.close(),
      print: (text: string, style?: string) => terminal.print(text, style),
    }
    ctx.set('tui', tui)

    // Toolbox button
    ctx.toolbox.addButton({
      id: 'ipe-cli-toggle',
      tooltip: 'ipe-cli 终端',
      icon: (() => {
        const el = document.createElement('span')
        el.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 9l3 3l-3 3" /><path d="M13 15l3 0" /><path d="M3 6a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -12" /></svg>'
        return el.firstElementChild as SVGElement
      })(),
      onClick: () => terminal.toggle(),
    })

    // First boot
    const booted = localStorage.getItem(STORAGE_KEY_BOOTED)
    if (!booted) {
      localStorage.setItem(STORAGE_KEY_BOOTED, '1')
      terminal.open()
      runBootSequence(terminal)
    } else {
      // 不是第一次，只打印 help 提示
      showTipForHelp(terminal)
    }

    // Cleanup on dispose
    ctx.on('dispose', () => {
      ctx.toolbox.removeButton('ipe-cli-toggle')
      terminal.dispose()
    })
  },
})
