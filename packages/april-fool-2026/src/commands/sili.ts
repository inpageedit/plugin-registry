import type { Command } from '../terminal/Registry.js'
import { TerminalStyle, type Terminal } from '../terminal/Terminal.js'
import { pick } from '../utils/pick.js'

/**
 * @returns {boolean} true - just entered SILI mode, false - already in SILI mode
 */
function enterSILIMode(terminal: Terminal): boolean {
  if (terminal.drawer.classList.contains('sili-mode')) return false
  terminal.drawer.classList.add('sili-mode')
  terminal.drawer.querySelector('.ipe-cli-topbar-title')!.textContent =
    'SILI CLI (?'
  terminal.inputEl.placeholder = '嘿嘿，我的 SILI 🤤'
  return true
}

const pingRandoms = [
  '诶，我在~',
  '叫我干嘛呀~',
  'Link start~',
  'Aye Aye Captain~',
  "I'm still alive~",
  'SILI在的哦，有什么事吗~',
  '喂，其实你看到我的回复了吧！',
  '你不会是拿SILI开心吧？',
  '我不在。',
]

const caoMemeBase =
  'https://r2.epb.wiki/cdn-cgi/image/format=auto,fit=contain,width=100,height=100,onerror=redirect/random/memes/cao/'
const caoMemeResponseChain = [
  '草',
  '花',
  '叶',
  '星',
  '日',
  '月',
  '水',
  '瓦',
  '海',
  '菜',
  'utf',
]
const getCaoMemeNextSrc = (word?: string): string => {
  const index = caoMemeResponseChain.indexOf(word || '')
  const nextWordIndex = (index + 1) % caoMemeResponseChain.length
  const nextWord = caoMemeResponseChain[nextWordIndex]
  const src = `${caoMemeBase}${nextWord}.jpg`
  return src
}

const bakaRegExp = new RegExp(`(笨蛋|傻瓜|傻子|⑨|智障|白痴|蠢货|baka)`, 'i')
const bakaResponses = [
  '¿你说谁是$1呢？',
  '别骂了别骂了，我真的不是$1',
  '哼，你才是$1呢',
  '$1？不是，我才不是呢！',
  '诶，$1不会指的是我吧？',
  '你礼貌吗？',
]

export function createSILICommand(terminal: Terminal): Command {
  return {
    name: 'sili',
    description: 'What the SILI doing?',
    usage:
      'sili [subcommand]\n' +
      ['草', 'wiki', '笨蛋'].map((cmd) => `  ${cmd}`).join('\n'),
    async action(ctx, argv) {
      const logger = ctx.logger('cli/sili')
      const justEntered = enterSILIMode(terminal)
      const subcommand = argv._[1]
      logger.info({ argv, justEntered, subcommand })

      // 第一次进入时，打印欢迎语
      if (justEntered) {
        terminal.print(
          `
┏┓┳┓ ┳
┗┓┃┃ ┃
┗┛┻┗┛┻
~The distributed data transmission network with Spatiotemporal Isomorphic and Limitless Interdimensional~
      `.trim()
        )
        terminal.print('\n', TerminalStyle.Muted)
        if (!subcommand) {
          terminal.print('奇怪，这是什么地方？这里不是QQ群吧……？\n')
          return
        }
      }

      if (caoMemeResponseChain.includes(subcommand?.toLowerCase() || '')) {
        // 草 meme
        const src = getCaoMemeNextSrc(subcommand?.toLowerCase() || '')
        const img = document.createElement('img')
        img.src = src
        img.alt = subcommand
        img.width = 100
        img.height = 100
        terminal.printElement(img)
        return
      } else if (subcommand === 'wiki') {
        // wiki = fetch
        const [_1, _2, ...pageParts] = argv._
        const pageName =
          pageParts.join(' ') || ctx.currentPage.wikiTitle!.toText()
        terminal.execute(`fetch ${pageName}`)
      } else if (bakaRegExp.test(subcommand || '')) {
        // sili 是笨蛋
        const keyword = bakaRegExp.exec(subcommand || '')![0]
        terminal.print(pick(bakaResponses).replace('$1', keyword))
      } else {
        // final fallback
        terminal.print(pick(pingRandoms))
      }
    },
  }
}
