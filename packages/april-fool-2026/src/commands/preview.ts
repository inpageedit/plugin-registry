import type { Command } from '../terminal/Registry.js'
import { TerminalStyle } from '../terminal/Terminal.js'
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
        terminal.print('已打开预览界面', TerminalStyle.Muted)
        return
      }

      terminal.print(`正在预览 ${title} ...`, TerminalStyle.Muted)
      const page = await ctx.wikiPage.newFromTitle(title)
      const rev = page.revisions?.[0]
      const content = rev?.content ?? rev?.['*'] ?? ''
      const result = await page.preview(content)
      const html = result.data?.parse?.text?.['*'] || result.data?.parse?.text
      if (html) {
        const iframe = document.createElement('iframe')
        iframe.sandbox.add('allow-same-origin')
        iframe.style.cssText = 'width:100%;border:1px solid #00ff4133;background:#fff;border-radius:2px;min-height:200px;max-height:60vh;'
        // Write content after appending so the iframe document is available
        const wrapper = document.createElement('div')
        wrapper.appendChild(iframe)
        terminal.printHTML('')  // append a container line
        const lastLine = terminal['outputEl'].lastElementChild as HTMLElement
        lastLine.appendChild(iframe)
        const doc = iframe.contentDocument!
        doc.open()
        doc.write(`<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:8px;margin:0;}</style></head><body>${html}</body></html>`)
        doc.close()
        // Auto-resize iframe to content height
        const resizeIframe = () => {
          iframe.style.height = doc.body.scrollHeight + 'px'
        }
        iframe.addEventListener('load', resizeIframe)
        resizeIframe()
      } else {
        terminal.print('预览失败: 无法获取渲染结果', TerminalStyle.Error)
      }
    },
  }
}
