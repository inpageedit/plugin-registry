import type { Command } from '../terminal/Registry.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createPreviewCommand(terminal: Terminal): Command {
  return {
    name: 'preview',
    description: '预览页面渲染结果',
    usage: 'preview [pagename] [--ui]',
    options: [
      { name: 'title', alias: 't', type: 'string' as const, description: '页面标题' },
      { name: 'ui', type: 'boolean' as const, description: '打开预览界面' },
    ],
    async action(ctx, argv) {
      const title = argv._[1] || argv.title || ctx.currentPage.title

      if (argv.ui) {
        const page = await ctx.wikiPage.newFromTitle(title)
        const rev = page.revisions?.[0]
        const content = rev?.content ?? rev?.['*'] ?? ''
        ctx.quickPreview(content, undefined, page)
        terminal.print('已打开预览界面', 'ipe-cli-muted')
        return
      }

      terminal.print(`正在预览 ${title} ...`, 'ipe-cli-muted')
      const page = await ctx.wikiPage.newFromTitle(title)
      const rev = page.revisions?.[0]
      const content = rev?.content ?? rev?.['*'] ?? ''
      const result = await page.preview(content)
      const html = result.data?.parse?.text?.['*'] || result.data?.parse?.text
      if (html) {
        terminal.printHTML(html)
      } else {
        terminal.print('预览失败: 无法获取渲染结果', 'ipe-cli-error')
      }
    },
  }
}
