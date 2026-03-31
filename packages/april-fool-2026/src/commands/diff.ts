import type { Command } from '../terminal/Registry.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createDiffCommand(terminal: Terminal): Command {
  return {
    name: 'diff',
    description: '比较两个修订版本',
    usage: 'diff <revid1> <revid2> [--ui]',
    options: [
      { name: 'ui', type: 'boolean' as const, description: '打开快速差异界面' },
    ],
    async action(ctx, argv) {
      const fromrev = Number(argv._[1])
      const torev = Number(argv._[2])

      if (!fromrev || !torev) {
        terminal.print('用法: diff <revid1> <revid2>', 'ipe-cli-error')
        return
      }

      ctx.quickDiff.comparePages({ fromrev, torev })
      terminal.print('已打开差异界面', 'ipe-cli-muted')
    },
  }
}
