import type { Command } from '../terminal/Registry.js'
import { TerminalStyle } from '../terminal/Terminal.js'
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
      const title = argv._[1] || argv.title || ctx.currentPage.wikiTitle.toText()

      if (argv.ui) {
        ctx.quickEdit({ title, section: argv.section })
        terminal.print('已打开编辑界面', TerminalStyle.Muted)
        return
      }

      const content = argv.content
      if (!content) {
        terminal.print('终端模式需要提供 --content 参数。', TerminalStyle.Error)
        terminal.print('提示: 使用 Shift+Enter 换行，或使用 <<EOF 语法输入多行内容。', TerminalStyle.Muted)
        terminal.print('示例: edit 页面名 --content <<EOF', TerminalStyle.Muted)
        return
      }

      terminal.print(`正在编辑 ${title} ...`, TerminalStyle.Muted)
      const page = await ctx.wikiPage.newFromTitle(title)
      const result = await page.edit({
        text: content,
        summary: argv.summary || 'via ipe-cli',
        minor: argv.minor || false,
        section: argv.section,
      })

      const data = result.data?.edit
      if (data) {
        const safeTitle = String(data.title).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const url = page.pageInfo?.fullurl || page.pageInfo?.canonicalurl || ''
        if (url) {
          const safeUrl = url.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          terminal.printHTML(
            `<span class="${TerminalStyle.Success}">Edit successful: ${safeTitle} (revid: ${data.newrevid}) <a href="${encodeURI(url)}" target="_blank">${safeUrl}</a></span>`
          )
        } else {
          terminal.print(`Edit successful: ${data.title} (revid: ${data.newrevid})`, TerminalStyle.Success)
        }
      }
    },
  }
}
