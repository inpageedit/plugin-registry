import { type InPageEdit } from '@inpageedit/core'
import { type ParsedArgs } from 'minimist'

export interface OptionDef {
  name: string
  alias?: string
  type: 'string' | 'boolean' | 'number'
  description: string
  required?: boolean
}

export interface Command {
  name: string
  description: string
  usage: string
  options?: OptionDef[]
  action: (ctx: InPageEdit, argv: ParsedArgs) => Promise<void> | void
}

export class CommandRegistry {
  private commands = new Map<string, Command>()

  register(cmd: Command): void {
    this.commands.set(cmd.name, cmd)
  }

  get(name: string): Command | undefined {
    return this.commands.get(name)
  }

  getAll(): Command[] {
    return Array.from(this.commands.values())
  }

  has(name: string): boolean {
    return this.commands.has(name)
  }

  formatHelpList(showHidden = false): string {
    const cmds = this.getAll().filter(
      (c) => showHidden || !c.name.startsWith('.')
    )
    if (!cmds.length) return ''
    const maxLen = Math.max(...cmds.map((c) => c.name.length))
    return cmds
      .map((c) => `  ${c.name.padEnd(maxLen + 2)}${c.description}`)
      .join('\n')
  }

  formatCommandHelp(name: string): string | null {
    const cmd = this.commands.get(name)
    if (!cmd) return null

    let text = `${cmd.name} — ${cmd.description}\n\n`
    text += `用法: ${cmd.usage}\n`

    if (cmd.options && cmd.options.length > 0) {
      text += '\n选项:\n'
      const maxLen = Math.max(
        ...cmd.options.map((opt) => {
          const flag = opt.alias
            ? `-${opt.alias}, --${opt.name}`
            : `    --${opt.name}`
          return flag.length
        })
      )
      for (const opt of cmd.options) {
        const flag = opt.alias
          ? `-${opt.alias}, --${opt.name}`
          : `    --${opt.name}`
        text += `  ${flag.padEnd(maxLen + 2)}${opt.description}\n`
      }
    }

    return text
  }
}
