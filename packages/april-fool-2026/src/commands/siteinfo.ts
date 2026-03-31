import type { Command } from '../terminal/Registry.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createSiteinfoCommand(terminal: Terminal): Command {
  return {
    name: 'siteinfo',
    description: '显示站点信息',
    usage: 'siteinfo',
    async action(ctx) {
      const site = ctx.wiki.siteInfo
      terminal.print(`站点名: ${site.sitename}`)
      terminal.print(`版本:   MediaWiki ${site.generator}`)
      terminal.print(`语言:   ${site.lang}`)
      terminal.print(`主页:   ${site.base}`)
    },
  }
}
