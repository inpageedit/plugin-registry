import type { Command } from '../terminal/Registry.js'
import { TerminalStyle } from '../terminal/Terminal.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createHelpCommand(terminal: Terminal): Command {
  return {
    name: 'help',
    description: '显示帮助信息',
    usage: 'help [command] [--all]',
    options: [
      { name: 'all', type: 'boolean' as const, description: '显示包括隐藏命令在内的所有命令' },
    ],
    action(_ctx, argv) {
      const cmdName = argv._[1]
      if (cmdName) {
        const text = terminal.registry.formatCommandHelp(cmdName)
        if (text) {
          terminal.print(text)
        } else {
          terminal.print(`未知命令: ${cmdName}`, TerminalStyle.Error)
        }
      } else {
        terminal.print('可用命令:\n')
        terminal.print(terminal.registry.formatHelpList(argv.all))
        if (!argv.all) {
          terminal.print('\n输入 "help --all" 查看隐藏命令。', TerminalStyle.Muted)
        }
        terminal.print('\n输入 "help <command>" 查看详细用法。', TerminalStyle.Muted)
      }
    },
  }
}
