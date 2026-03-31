import type { Command } from '../terminal/Registry.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createMoveCommand(terminal: Terminal): Command {
  return {
    name: 'move',
    description: '移动/重命名页面',
    usage: 'move <from> <to> [--reason "..."] [--no-redirect] [--ui]',
    options: [
      { name: 'from', type: 'string' as const, description: '源页面标题' },
      { name: 'to', type: 'string' as const, description: '目标页面标题' },
      { name: 'reason', type: 'string' as const, description: '移动原因' },
      { name: 'no-redirect', type: 'boolean' as const, description: '不留下重定向' },
      { name: 'ui', type: 'boolean' as const, description: '打开快速移动界面' },
    ],
    async action(ctx, argv) {
      const from = argv._[1] || argv.from
      const to = argv._[2] || argv.to

      if (argv.ui) {
        ctx.quickMove.showModal({ from, to })
        terminal.print('已打开移动界面', 'ipe-cli-muted')
        return
      }

      if (!from || !to) {
        terminal.print('用法: move <from> <to>', 'ipe-cli-error')
        return
      }

      terminal.print(`正在移动 ${from} → ${to} ...`, 'ipe-cli-muted')
      const page = await ctx.wikiPage.newFromTitle(from)
      await page.moveTo(to, argv.reason, {
        noredirect: argv['no-redirect'] === true,
      })
      terminal.print(`Move successful: ${from} → ${to}`, 'ipe-cli-success')
    },
  }
}
