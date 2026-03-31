import type { Command } from '../terminal/Registry.js'
import { TerminalStyle } from '../terminal/Terminal.js'
import type { Terminal } from '../terminal/Terminal.js'

export function createUploadCommand(terminal: Terminal): Command {
  return {
    name: 'upload',
    description: '上传文件',
    usage: 'upload --ui',
    options: [
      { name: 'ui', type: 'boolean' as const, description: '打开上传界面' },
    ],
    async action(ctx, argv) {
      if (!argv.ui) {
        terminal.print('终端无法选择本地文件，请使用 upload --ui', TerminalStyle.Error)
        return
      }
      await ctx.quickUpload.showModal()
      terminal.print('已打开上传界面', TerminalStyle.Muted)
    },
  }
}
