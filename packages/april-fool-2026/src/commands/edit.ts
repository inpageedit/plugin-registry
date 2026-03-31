import type { Command } from '../terminal/Registry.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createEditCommand(terminal: Terminal): Command {
  return {
    name: 'edit',
    description: '编辑页面',
    usage: 'edit [pagename] [--ui] [--section N] [--summary "..."] [--content "..."]',
    options: [
      { name: 'title', alias: 't', type: 'string' as const, description: '页面标题' },
      { name: 'ui', type: 'boolean' as const, description: '打开快速编辑界面' },
      { name: 'section', alias: 's', type: 'number' as const, description: '段落编号' },
      { name: 'summary', type: 'string' as const, description: '编辑摘要' },
      { name: 'content', alias: 'c', type: 'string' as const, description: '页面内容' },
      { name: 'minor', alias: 'm', type: 'boolean' as const, description: '标记为小编辑' },
    ],
    async action(ctx, argv) {
      const title = argv._[1] || argv.title || ctx.currentPage.title

      if (argv.ui) {
        ctx.quickEdit({ title, section: argv.section })
        terminal.print('已打开编辑界面', 'ipe-cli-muted')
        return
      }

      const content = argv.content
      if (!content) {
        terminal.print('终端模式需要提供 --content 参数。', 'ipe-cli-error')
        terminal.print('提示: 使用 Shift+Enter 换行，或使用 <<EOF 语法输入多行内容。', 'ipe-cli-muted')
        terminal.print('示例: edit 页面名 --content <<EOF', 'ipe-cli-muted')
        return
      }

      terminal.print(`正在编辑 ${title} ...`, 'ipe-cli-muted')
      const page = await ctx.wikiPage.newFromTitle(title)
      const result = await page.edit({
        text: content,
        summary: argv.summary || 'via ipe-cli',
        minor: argv.minor || false,
        section: argv.section,
      })

      const data = result.data?.edit
      if (data) {
        const url = page.pageInfo?.fullurl || page.pageInfo?.canonicalurl || ''
        terminal.print(
          `Edit successful: ${data.title} (revid: ${data.newrevid}) ${url ? `<a href="${url}" target="_blank">${url}</a>` : ''}`,
          'ipe-cli-success'
        )
      }
    },
  }
}
