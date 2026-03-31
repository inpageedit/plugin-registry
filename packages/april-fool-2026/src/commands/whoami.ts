import type { Command } from '../terminal/Registry.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createWhoamiCommand(terminal: Terminal): Command {
  return {
    name: 'whoami',
    description: '显示当前用户信息',
    usage: 'whoami',
    async action(ctx) {
      const user = ctx.wiki.userInfo
      terminal.print(`用户名: ${user.name}`)
      terminal.print(`用户ID: ${user.id}`)
      terminal.print(`用户组: ${user.groups?.join(', ') || '(无)'}`)
    },
  }
}
