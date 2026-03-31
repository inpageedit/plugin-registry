import type { Command } from '../terminal/Registry.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createSiteinfoCommand(terminal: Terminal): Command {
  return {
    name: 'siteinfo',
    description: '显示站点信息',
    usage: 'siteinfo',
    async action(ctx) {
      const general = ctx.wiki.general
      terminal.print(`站点名: ${general.sitename}`)
      terminal.print(`版本:   ${general.generator}`)
      terminal.print(`语言:   ${general.lang}`)
      terminal.print(`主页:   ${general.base}`)
    },
  }
}
