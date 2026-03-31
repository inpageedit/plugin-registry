import type { Command } from '../terminal/Registry.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createPreferencesCommand(terminal: Terminal): Command {
  return {
    name: 'preferences',
    description: '查看或修改设置',
    usage: 'preferences list | get <key> | set <key> <value> [--ui]',
    options: [
      { name: 'ui', type: 'boolean' as const, description: '打开设置面板' },
    ],
    async action(ctx, argv) {
      if (argv.ui) {
        ctx.preferencesUI.showModal()
        terminal.print('已打开设置面板', 'ipe-cli-muted')
        return
      }

      const subcommand = argv._[1]

      if (!subcommand || subcommand === 'list') {
        const all = await ctx.preferences.get()
        const entries = Object.entries(all as Record<string, unknown>).sort(([a], [b]) =>
          a.localeCompare(b)
        )
        for (const [key, value] of entries) {
          terminal.print(`${key} = ${JSON.stringify(value)}`)
        }
        return
      }

      if (subcommand === 'get') {
        const key = argv._[2]
        if (!key) {
          terminal.print('用法: preferences get <key>', 'ipe-cli-error')
          return
        }
        const value = await ctx.preferences.get(key)
        terminal.print(`${key} = ${JSON.stringify(value)}`)
        return
      }

      if (subcommand === 'set') {
        const key = argv._[2]
        const rawValue = argv._[3]
        if (!key || rawValue === undefined) {
          terminal.print('用法: preferences set <key> <value>', 'ipe-cli-error')
          return
        }
        let value: unknown = rawValue
        try {
          value = JSON.parse(String(rawValue))
        } catch {}
        await ctx.preferences.set(key, value)
        terminal.print(`${key} = ${JSON.stringify(value)}`, 'ipe-cli-success')
        return
      }

      terminal.print(`未知子命令: ${subcommand}。可用: list, get, set`, 'ipe-cli-error')
    },
  }
}
