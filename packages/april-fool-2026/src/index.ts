import './style.scss'

import { defineIPEPlugin } from '~~/defineIPEPlugin.js'
import { Terminal } from './terminal/Terminal.js'
import { runBootSequence } from './terminal/boot.js'
import { registerAllCommands } from './commands/index.js'

const STORAGE_KEY_BOOTED = 'ipe-cli-booted'

export default defineIPEPlugin({
  name: 'april-fool-2026',
  inject: ['toolbox'],
  apply(ctx) {
    const terminal = new Terminal(ctx)
    registerAllCommands(terminal)

    // Expose ctx.tui API for third-party plugins
    ;(ctx as any).tui = {
      command: (name: string, def: any) => terminal.registry.register({ name, ...def }),
      open: () => terminal.open(),
      close: () => terminal.close(),
      print: (text: string, style?: string) => terminal.print(text, style),
    }

    // Toolbox button
    ctx.toolbox.addButton({
      id: 'ipe-cli-toggle',
      tooltip: 'ipe-cli 终端',
      icon: '>_',
      onClick: () => terminal.toggle(),
    })

    // First boot
    const booted = localStorage.getItem(STORAGE_KEY_BOOTED)
    if (!booted) {
      localStorage.setItem(STORAGE_KEY_BOOTED, '1')
      terminal.open()
      runBootSequence(terminal)
    }

    // Cleanup on dispose
    ctx.on('dispose', () => {
      ctx.toolbox.removeButton('ipe-cli-toggle')
      terminal.dispose()
    })
  },
})
