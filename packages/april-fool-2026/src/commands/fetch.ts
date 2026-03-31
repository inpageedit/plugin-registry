import type { Command } from '../terminal/Registry.js'
import { TerminalStyle } from '../terminal/Terminal.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createFetchCommand(terminal: Terminal): Command {
  return {
    name: 'fetch',
    description: '获取页面源码',
    usage: 'fetch [pagename]',
    options: [
      { name: 'title', alias: 't', type: 'string' as const, description: '页面标题' },
      { name: 'section', alias: 's', type: 'number' as const, description: '段落编号' },
    ],
    async action(ctx, argv) {
      const title = argv._[1] || argv.title || ctx.currentPage.wikiTitle.toText()
      terminal.print(`正在获取 ${title} ...`, TerminalStyle.Muted)

      const page = await ctx.wikiPage.newFromTitle(title, false, argv.section)
      const rev = page.revisions?.[0]
      const content = rev?.content ?? rev?.['*']

      if (content == null) {
        terminal.print(`页面 ${title} 没有内容或不存在。`, TerminalStyle.Error)
        return
      }

      terminal.print(content)
    },
  }
}
