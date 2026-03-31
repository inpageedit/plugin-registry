import type { Terminal } from './Terminal.js'

interface BootStep {
  text: string
  className?: string
  delay: number
}

const punchlines = [
  '编辑维基是属于人类的艺术。向来如此。',
  '最好的语言模型，是你的大脑。',
  'AI 写不出好条目。你可以。',
  '你不需要 AI 来写一篇好文章。',
  '神经网络宕机了，但你的神经元还在。',
]

function randomPunchline(): string {
  return punchlines[Math.floor(Math.random() * punchlines.length)]
}

function buildBootSteps(): BootStep[] {
  return [
    { text: '> 正在初始化 ipe-cli v1.0.0...', delay: 0 },
    { text: '> 加载 MCP 服务器配置...                      ✓', className: 'ipe-cli-success', delay: 500 },
    { text: '> 连接 Claude API 端点...                     ✓', className: 'ipe-cli-success', delay: 700 },
    { text: '> 验证 Agent 凭证...                          ✓', className: 'ipe-cli-success', delay: 600 },
    { text: '> 下载神经语言模型 (7B)...   [█████░░░░░] 42%', className: 'ipe-cli-success', delay: 700 },
    { text: '> ERROR: 连接被拒绝                            ✗', className: 'ipe-cli-error', delay: 1000 },
    { text: '> ERROR: AI 模块初始化失败                      ✗', className: 'ipe-cli-error', delay: 500 },
    { text: '', delay: 500 },
    { text: `  ${randomPunchline()}`, className: 'ipe-cli-highlight', delay: 500 },
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
  terminal.print('输入 "help" 查看所有可用命令。', 'ipe-cli-muted')
  terminal.setInputEnabled(true)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
