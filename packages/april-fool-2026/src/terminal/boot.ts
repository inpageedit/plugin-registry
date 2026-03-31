import { pick } from '../utils/pick.js'
import { sleep } from '../utils/sleep.js'
import { TerminalStyle } from './Terminal.js'
import type { Terminal } from './Terminal.js'

interface BootStep {
  text: string
  className?: string
  delay: number
}

const llmProviders = [
  'Claude',
  'Gemini',
  'LLaMA',
  'ChatGPT',
  'Bard',
  'Ernie Bot',
  'Qwen',
  'DeepSeek',
]

const punchlines = [
  '编辑 wiki 是属于人类的艺术。向来如此！\n  Wiki editing is a human art. Always has been!',
  '切换到SOTA模型：你的大脑！百万 token 仅消耗 20 卡路里！\n  Switching to SOTA model: your brain! 1M tokens for just 20 calories!',
  "AI 写不出好条目。但你可以——伟大的编辑者！\n  AI can't write a good article. But you can — great editor!",
  "你不需要 AI 来写一篇好文章。没有 AI 的才华比得上你！\n  You don't need AI to write a good article. No AI talent compares to yours!",
  '神经网络宕机了，但你的神经元无比健壮！\n  Neural network crashed, but your neurons are rock solid!',
]

function buildBootSteps(): BootStep[] {
  return [
    { text: '> 正在初始化 ipe-cli v1.0.0...', delay: 0 },
    {
      text: '> 加载 MCP 服务器配置...                      ✓',
      className: TerminalStyle.Success,
      delay: 200,
    },
    {
      text: `> 正在加载 20,260,401 个 SKILLs...            ✓`,
      className: TerminalStyle.Success,
      delay: 300,
    },
    {
      text: `> 连接 ${pick(llmProviders)} API 端点...                     ✓`,
      className: TerminalStyle.Success,
      delay: 700,
    },
    {
      text: '> 验证 Agent 凭证...                          ✓',
      className: TerminalStyle.Success,
      delay: 600,
    },
    {
      text: '> 下载神经语言模型 (7B)...     [█████░░░░░] 42%',
      className: TerminalStyle.Success,
      delay: 700,
    },
    {
      text: '> ERROR: 连接被拒绝                           ✗',
      className: TerminalStyle.Error,
      delay: 1000,
    },
    {
      text: '> ERROR: AI 模块初始化失败                    ✗',
      className: TerminalStyle.Error,
      delay: 500,
    },
    { text: '', delay: 500 },
    {
      text: `  ${pick(punchlines)}`,
      className: TerminalStyle.Highlight,
      delay: 500,
    },
  ]
}

export async function runBootSequence(terminal: Terminal): Promise<void> {
  terminal.setInputEnabled(false)

  const steps = buildBootSteps()
  for (const step of steps) {
    await sleep(step.delay)
    terminal.print(step.text, step.className)
  }

  await sleep(1500)
  showTipForHelp(terminal)
  terminal.setInputEnabled(true)
}

export function showTipForHelp(terminal: Terminal): void {
  terminal.print(
    '输入 "help" 查看所有可用命令。Type "help" to see all commands.',
    TerminalStyle.Muted
  )
}


