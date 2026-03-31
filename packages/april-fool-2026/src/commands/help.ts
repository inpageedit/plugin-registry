import type { Command } from '../terminal/Registry.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createHelpCommand(terminal: Terminal): Command {
  return {
    name: 'help',
    description: '显示帮助信息',
    usage: 'help [command]',
    action(_ctx, argv) {
      const cmdName = argv._[1]
      if (cmdName) {
        const text = terminal.registry.formatCommandHelp(cmdName)
        if (text) {
          terminal.print(text)
        } else {
          terminal.print(`未知命令: ${cmdName}`, 'ipe-cli-error')
        }
      } else {
        terminal.print('可用命令:\n')
        terminal.print(terminal.registry.formatHelpList())
        terminal.print('\n输入 "help <command>" 查看详细用法。', 'ipe-cli-muted')
      }
    },
  }
}
