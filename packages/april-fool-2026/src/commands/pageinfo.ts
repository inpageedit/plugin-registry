import type { Command } from '../terminal/Registry.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createPageinfoCommand(terminal: Terminal): Command {
  return {
    name: 'pageinfo',
    description: '显示页面信息',
    usage: 'pageinfo [pagename]',
    options: [
      { name: 'title', alias: 't', type: 'string' as const, description: '页面标题' },
    ],
    async action(ctx, argv) {
      const title = argv._[1] || argv.title || ctx.currentPage.title
      const page = await ctx.wikiPage.newFromTitle(title)
      const info = page.pageInfo

      terminal.print(`标题:     ${info.title}`)
      terminal.print(`页面ID:   ${info.pageid}`)
      terminal.print(`命名空间: ${info.ns}`)
      terminal.print(`内容模型: ${info.contentmodel}`)
      terminal.print(`最后修订: ${info.lastrevid}`)
      terminal.print(`最后编辑: ${info.touched}`)

      const url = info.fullurl || info.canonicalurl
      if (url) {
        terminal.printHTML(`链接:     <a href="${encodeURI(url)}" target="_blank">${url.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a>`)
      }
    },
  }
}
