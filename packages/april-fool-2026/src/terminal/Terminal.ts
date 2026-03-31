import { type InPageEdit } from '@inpageedit/core'
import { CommandRegistry } from './Registry.js'
import { parseArgv } from './parser.js'

export enum TerminalStyle {
  Success = 'ipe-cli-success',
  Error = 'ipe-cli-error',
  Warning = 'ipe-cli-warning-text',
  Info = 'ipe-cli-info',
  Muted = 'ipe-cli-muted',
  Highlight = 'ipe-cli-highlight',
}

const STORAGE_KEY_HISTORY = 'ipe-cli-history'
const STORAGE_KEY_HEIGHT = 'ipe-cli-height'
const STORAGE_KEY_WARNING = 'ipe-cli-warning-dismissed'
const MAX_HISTORY = 50

export class Terminal {
  public registry = new CommandRegistry()

  private drawer!: HTMLDivElement
  private outputEl!: HTMLDivElement
  private inputEl!: HTMLTextAreaElement
  private warningEl!: HTMLDivElement

  private history: string[] = []
  private historyIndex = -1
  private currentInput = ''

  private heredocMarker: string | null = null
  private heredocBuffer: string[] = []
  private heredocPrefix = ''

  private isVisible = false

  constructor(private ctx: InPageEdit) {
    this.loadHistory()
    this.createDOM()
  }

  open(): void {
    this.isVisible = true
    this.drawer.classList.remove('ipe-cli-hidden')
    this.inputEl.focus()
    this.ctx.emit('tui/open', { ctx: this.ctx })
  }

  close(): void {
    this.isVisible = false
    this.drawer.classList.add('ipe-cli-hidden')
    this.ctx.emit('tui/close', { ctx: this.ctx })
  }

  toggle(): void {
    this.isVisible ? this.close() : this.open()
  }

  print(text: string, className?: string): void {
    const line = document.createElement('div')
    if (className) line.className = className
    line.textContent = text
    this.outputEl.appendChild(line)
    this.outputEl.scrollTop = this.outputEl.scrollHeight
  }

  printHTML(html: string): void {
    const line = document.createElement('div')
    line.innerHTML = html
    this.outputEl.appendChild(line)
    this.outputEl.scrollTop = this.outputEl.scrollHeight
  }

  clear(): void {
    this.outputEl.innerHTML = ''
  }

  setInputEnabled(enabled: boolean): void {
    this.inputEl.disabled = !enabled
  }

  dispose(): void {
    this.drawer.remove()
  }

  private createDOM(): void {
    this.drawer = document.createElement('div')
    this.drawer.className = 'ipe-cli-drawer ipe-cli-hidden'

    const savedHeight = localStorage.getItem(STORAGE_KEY_HEIGHT)
    if (savedHeight) this.drawer.style.height = savedHeight

    const topbar = document.createElement('div')
    topbar.className = 'ipe-cli-topbar'
    topbar.innerHTML = `
      <span class="ipe-cli-topbar-title">ipe-cli v2026.04.01</span>
      <span class="ipe-cli-topbar-actions">
        <button class="ipe-cli-topbar-help" title="What is this?">?</button>
        <button class="ipe-cli-topbar-close">×</button>
      </span>
    `
    const closeBtn = topbar.querySelector('.ipe-cli-topbar-close')!
    closeBtn.addEventListener('click', () => this.close())
    const helpBtn = topbar.querySelector('.ipe-cli-topbar-help')!
    helpBtn.addEventListener('click', () => {
      this.print('🎉 哈哈，骗到你啦！InPageEdit 向来有在每年愚人节整活的传统。如果不喜欢，输入 .uninstall 即可卸载哦！感谢你的使用~')
      this.print('🎉 Gotcha! InPageEdit has a tradition of April Fools\' pranks every year. If you don\'t like it, type .uninstall to remove it. Thanks for using InPageEdit!')
    })
    this.setupResize(topbar, topbar.querySelector('.ipe-cli-topbar-actions')! as HTMLElement)

    this.warningEl = document.createElement('div')
    this.warningEl.className = 'ipe-cli-warning'
    this.warningEl.innerHTML = `
      <span>⚠ 虽然这看上去很搞笑，但你在这里的操作（编辑、移动、删除等）都是真实的！ / Actions here (edit, move, delete, etc.) are REAL!</span>
      <button class="ipe-cli-warning-close">×</button>
    `
    this.warningEl
      .querySelector('.ipe-cli-warning-close')!
      .addEventListener('click', () => {
        this.warningEl.style.display = 'none'
        localStorage.setItem(STORAGE_KEY_WARNING, '1')
      })
    if (localStorage.getItem(STORAGE_KEY_WARNING) === '1') {
      this.warningEl.style.display = 'none'
    }

    this.outputEl = document.createElement('div')
    this.outputEl.className = 'ipe-cli-output'

    const inputArea = document.createElement('div')
    inputArea.className = 'ipe-cli-input-area'

    const prompt = document.createElement('span')
    prompt.className = 'ipe-cli-prompt'
    prompt.textContent = '✏️ '

    this.inputEl = document.createElement('textarea')
    this.inputEl.className = 'ipe-cli-input'
    this.inputEl.rows = 1
    this.inputEl.spellcheck = false
    this.inputEl.autocomplete = 'off'
    this.inputEl.placeholder = '输入命令...'
    this.setupInput()

    inputArea.append(prompt, this.inputEl)
    this.drawer.append(topbar, this.warningEl, this.outputEl, inputArea)
    document.body.appendChild(this.drawer)
  }

  private setupInput(): void {
    this.inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.shiftKey) {
        return
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this.handleSubmit()
        return
      }

      if (e.key === 'ArrowUp' && !this.heredocMarker) {
        e.preventDefault()
        this.navigateHistory(-1)
        return
      }

      if (e.key === 'ArrowDown' && !this.heredocMarker) {
        e.preventDefault()
        this.navigateHistory(1)
        return
      }
    })

    this.inputEl.addEventListener('input', () => {
      this.inputEl.style.height = 'auto'
      this.inputEl.style.height = this.inputEl.scrollHeight + 'px'
    })
  }

  private handleSubmit(): void {
    const value = this.inputEl.value
    this.inputEl.value = ''
    this.inputEl.style.height = 'auto'

    if (this.heredocMarker) {
      if (value.trim() === this.heredocMarker) {
        const content = this.heredocBuffer.join('\n')
        const fullInput =
          this.heredocPrefix +
          '"' +
          content.replace(/\\/g, '\\\\').replace(/"/g, '\\"') +
          '"'
        this.heredocMarker = null
        this.heredocBuffer = []
        this.heredocPrefix = ''
        this.execute(fullInput, true)
      } else {
        this.heredocBuffer.push(value)
        this.print(`✏️ ${value}`, TerminalStyle.Muted)
      }
      return
    }

    const heredocMatch = value.match(/<<(\w+)\s*$/)
    if (heredocMatch) {
      this.heredocMarker = heredocMatch[1]
      this.heredocPrefix = value.slice(0, heredocMatch.index!) + ''
      this.heredocBuffer = []
      this.print(`✏️ ${value}`, TerminalStyle.Muted)
      return
    }

    this.execute(value)
  }

  async execute(input: string, skipEcho = false): Promise<void> {
    const trimmed = input.trim()
    if (!trimmed) return

    if (!skipEcho) {
      this.print(`✏️ ${trimmed}`, TerminalStyle.Muted)
    }

    this.pushHistory(trimmed)
    this.historyIndex = -1
    this.currentInput = ''

    const argv = parseArgv(trimmed)
    const cmdName = argv._[0]

    if (!cmdName) return

    if (argv.help && cmdName !== 'help') {
      const helpText = this.registry.formatCommandHelp(cmdName)
      if (helpText) {
        this.print(helpText)
      } else {
        this.print(`未知命令: ${cmdName}`, TerminalStyle.Error)
      }
      return
    }

    const cmd = this.registry.get(cmdName)
    if (!cmd) {
      const handled = this.ctx.bail('tui/command-not-found', {
        ctx: this.ctx,
        input: trimmed,
        command: cmdName,
      })
      if (!handled) {
        this.print(
          `未知命令: ${cmdName}。输入 "help" 查看可用命令。`,
          TerminalStyle.Error
        )
      }
      return
    }

    // bail: listeners can return a truthy value to intercept execution
    const intercepted = this.ctx.bail('tui/before-execute', {
      ctx: this.ctx,
      input: trimmed,
      command: cmdName,
    })
    if (intercepted) return

    try {
      this.setInputEnabled(false)
      await cmd.action(this.ctx, argv)
    } catch (err: any) {
      const message = `Error: ${err?.message || err}`
      this.print(message, TerminalStyle.Error)
      this.ctx.emit('tui/error', {
        ctx: this.ctx,
        message,
        cause: err,
        command: cmdName,
      })
    } finally {
      this.setInputEnabled(true)
      this.inputEl.focus()
    }

    this.ctx.emit('tui/after-execute', {
      ctx: this.ctx,
      input: trimmed,
      command: cmdName,
    })
  }

  private navigateHistory(direction: number): void {
    if (this.history.length === 0) return

    if (this.historyIndex === -1) {
      this.currentInput = this.inputEl.value
    }

    if (direction === -1) {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++
      }
    } else {
      if (this.historyIndex > -1) {
        this.historyIndex--
      }
    }

    if (this.historyIndex === -1) {
      this.inputEl.value = this.currentInput
    } else {
      this.inputEl.value = this.history[this.historyIndex]
    }

    this.inputEl.style.height = 'auto'
    this.inputEl.style.height = this.inputEl.scrollHeight + 'px'
  }

  private pushHistory(input: string): void {
    const idx = this.history.indexOf(input)
    if (idx !== -1) this.history.splice(idx, 1)
    this.history.unshift(input)
    if (this.history.length > MAX_HISTORY) this.history.pop()
    this.saveHistory()
  }

  private loadHistory(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY)
      if (raw) this.history = JSON.parse(raw)
    } catch {}
  }

  private saveHistory(): void {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(this.history))
  }

  private setupResize(handle: HTMLElement, excludeEl: HTMLElement): void {
    let startY = 0
    let startHeight = 0

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      const delta = startY - e.clientY
      const newHeight = Math.min(
        Math.max(startHeight + delta, 120),
        window.innerHeight * 0.8
      )
      this.drawer.style.height = newHeight + 'px'
    }

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const delta = startY - e.touches[0].clientY
      const newHeight = Math.min(
        Math.max(startHeight + delta, 120),
        window.innerHeight * 0.8
      )
      this.drawer.style.height = newHeight + 'px'
    }

    const onEnd = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onEnd)
      document.body.style.userSelect = ''
      localStorage.setItem(STORAGE_KEY_HEIGHT, this.drawer.style.height)
    }

    const startDrag = (clientY: number) => {
      startY = clientY
      startHeight = this.drawer.offsetHeight
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onEnd)
      document.addEventListener('touchmove', onTouchMove, { passive: false })
      document.addEventListener('touchend', onEnd)
    }

    handle.addEventListener('mousedown', (e: MouseEvent) => {
      if (excludeEl.contains(e.target as Node)) return
      e.preventDefault()
      startDrag(e.clientY)
    })

    handle.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        if (excludeEl.contains(e.target as Node)) return
        startDrag(e.touches[0].clientY)
      },
      { passive: true }
    )
  }
}
