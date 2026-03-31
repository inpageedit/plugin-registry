import type { Command } from '../terminal/Registry.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createClearCommand(terminal: Terminal): Command {
  return {
    name: 'clear',
    description: '清空终端',
    usage: 'clear',
    action() {
      terminal.clear()
    },
  }
}
