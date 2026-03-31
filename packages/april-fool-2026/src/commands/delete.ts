import type { Command } from '../terminal/Registry.js'
import { TerminalStyle } from '../terminal/Terminal.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createDeleteCommand(terminal: Terminal): Command {
  return {
    name: 'delete',
    description: '删除页面',
    usage: 'delete <pagename> [--reason "..."]',
    options: [
      { name: 'title', alias: 't', type: 'string' as const, description: '页面标题' },
      { name: 'reason', type: 'string' as const, description: '删除原因' },
    ],
    async action(ctx, argv) {
      const title = argv._[1] || argv.title
      if (!title) {
        terminal.print('用法: delete <pagename>', TerminalStyle.Error)
        return
      }

      terminal.print(`正在删除 ${title} ...`, TerminalStyle.Muted)
      const page = await ctx.wikiPage.newFromTitle(title)
      await page.delete(argv.reason)
      terminal.print(`Delete successful: ${title}`, TerminalStyle.Success)
    },
  }
}
