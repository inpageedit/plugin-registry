import type { Command } from '../terminal/Registry.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createRedirectCommand(terminal: Terminal): Command {
  return {
    name: 'redirect',
    description: '创建重定向',
    usage: 'redirect <from> <to> [--ui]',
    options: [
      { name: 'from', type: 'string' as const, description: '重定向页面' },
      { name: 'to', type: 'string' as const, description: '目标页面' },
      { name: 'ui', type: 'boolean' as const, description: '打开快速重定向界面' },
    ],
    async action(ctx, argv) {
      const from = argv._[1] || argv.from
      const to = argv._[2] || argv.to

      if (argv.ui) {
        ctx.quickRedirect.showModal({ from, to })
        terminal.print('已打开重定向界面', 'ipe-cli-muted')
        return
      }

      if (!from || !to) {
        terminal.print('用法: redirect <from> <to>', 'ipe-cli-error')
        return
      }

      terminal.print(`正在创建重定向 ${from} → ${to} ...`, 'ipe-cli-muted')
      await ctx.quickRedirect.redirectPage({ from, to })
      terminal.print(`Redirect successful: ${from} → ${to}`, 'ipe-cli-success')
    },
  }
}
