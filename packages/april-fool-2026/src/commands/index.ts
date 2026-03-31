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
    usage: '.uninstall',
    action(ctx) {
      terminal.print('如需卸载 ipe-cli，请前往 InPageEdit 设置 → 插件商店，找到此插件并卸载。')
      terminal.print('To uninstall ipe-cli, go to InPageEdit Settings → Plugin Store, find this plugin and uninstall it.')
      terminal.print('')
      terminal.print('preferences --ui', TerminalStyle.Muted)
    },
  })
}
