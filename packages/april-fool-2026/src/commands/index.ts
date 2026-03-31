import { TerminalStyle, type Terminal } from '../terminal/Terminal.js'
import { runBootSequence } from '../terminal/boot.js'

import { createHelpCommand } from './help.js'
import { createClearCommand } from './clear.js'
import { createWhoamiCommand } from './whoami.js'
import { createSiteinfoCommand } from './siteinfo.js'
import { createPageinfoCommand } from './pageinfo.js'
import { createFetchCommand } from './fetch.js'
import { createEditCommand } from './edit.js'
import { createMoveCommand } from './move.js'
import { createDeleteCommand } from './delete.js'
import { createRedirectCommand } from './redirect.js'
import { createPreviewCommand } from './preview.js'
import { createDiffCommand } from './diff.js'
import { createUploadCommand } from './upload.js'
import { createPreferencesCommand } from './preferences.js'

export function registerAllCommands(terminal: Terminal): void {
  const commands = [
    createHelpCommand(terminal),
    createClearCommand(terminal),
    createFetchCommand(terminal),
    createEditCommand(terminal),
    createMoveCommand(terminal),
    createDeleteCommand(terminal),
    createRedirectCommand(terminal),
    createPreviewCommand(terminal),
    createDiffCommand(terminal),
    createUploadCommand(terminal),
    createWhoamiCommand(terminal),
    createSiteinfoCommand(terminal),
    createPageinfoCommand(terminal),
    createPreferencesCommand(terminal),
  ]

  for (const cmd of commands) {
    terminal.registry.register(cmd)
  }

  // Internal commands (dot-prefixed, hidden from help list)
  terminal.registry.register({
    name: '.init',
    description: '重播首次加载动画',
    usage: '.init',
    action() {
      return runBootSequence(terminal)
    },
  })

  terminal.registry.register({
    name: '.uninstall',
    description: '卸载此插件 / Uninstall this plugin',
    usage: '.uninstall [--hey-stupid-dev-you-are-not-funny-remove-this-green-junk-from-my-browser-right-now]',
    options: [
      { name: 'hey-stupid-dev-you-are-not-funny-remove-this-green-junk-from-my-browser-right-now', type: 'boolean' as const, description: '确认卸载 / Confirm uninstall' },
    ],
    async action(ctx, argv) {
      if (argv['hey-stupid-dev-you-are-not-funny-remove-this-green-junk-from-my-browser-right-now']) {
        terminal.setInputEnabled(false)
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

        terminal.print('...')
        await sleep(1000)
        terminal.print('居然真输入这么长一串，服了你了。', TerminalStyle.Highlight)
        await sleep(1500)
        terminal.print('')
        terminal.print('> 正在关闭 MCP 连接...                        ✓', TerminalStyle.Muted)
        await sleep(400)
        terminal.print('> 释放神经网络权重...                          ✓', TerminalStyle.Muted)
        await sleep(400)
        terminal.print('> 清理 Agent 凭证...                          ✓', TerminalStyle.Muted)
        await sleep(400)
        terminal.print('> 删除聊天记录...                              ✓', TerminalStyle.Muted)
        await sleep(600)
        terminal.print('')
        terminal.print('^C 退出中断', TerminalStyle.Warning)
        await sleep(500)
        terminal.print('稍等，让我说最后一句话：', TerminalStyle.Highlight)
        terminal.print('再见，伟大的编辑者。祝你写出最好的条目。', TerminalStyle.Highlight)
        await sleep(1500)
        terminal.print('')
        terminal.print('Farewell. / 永别。', TerminalStyle.Muted)
        await sleep(1500)

        // Clean up localStorage artifacts
        localStorage.removeItem('ipe-cli-booted')
        localStorage.removeItem('ipe-cli-history')
        localStorage.removeItem('ipe-cli-height')
        localStorage.removeItem('ipe-cli-warning-dismissed')
        // Find all registries that have this plugin installed and uninstall from each
        const plugins = await ctx.preferences.get('pluginStore.plugins', [])
        const matches = (plugins || []).filter((p: any) => p.id === 'april-fool-2026')
        for (const match of matches) {
          await ctx.store.uninstallAndRemovePreference(match.registry, match.id)
        }
        return
      }
      terminal.print('如需卸载 ipe-cli，请前往 InPageEdit Preferences → Plugin Store，找到此插件并卸载。')
      terminal.print('To uninstall ipe-cli, go to InPageEdit Preferences → Plugin Store, find this plugin and uninstall it.')
      terminal.print('')
      terminal.print('或执行 / Or run: .uninstall --hey-stupid-dev-you-are-not-funny-remove-this-green-junk-from-my-browser-right-now', TerminalStyle.Muted)
    },
  })
}
