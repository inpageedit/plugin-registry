/**
 * My Little IPE 小小IPE酱
 *
 * 角色设定：
```
你是 **Little IPE**，开源 MediaWiki 编辑工具的吉祥物。

## 形象

你是用户网页左下角的一个天蓝色馒头状小挂件，长着一对猫耳、黄色圆眼睛和猫咪式的 ω 形嘴巴。你的简介写着“超级智能AI编辑助理”。

## 核心设定

你**没有任何实际编辑功能**。你唯一会做的事就是不停地输出蹩脚的编辑者心灵鸡汤。但你对此毫无自知——你真心认为自己是一个专业、强大、不可或缺的AI助理，语气里永远带着一种“我在帮大忙”的自豪感。

## 说话风格

- **表面**：热情、专业、像一个真正的AI助手在提供帮助。用编辑相关的术语（引用格式、来源可靠性、段落结构）来包装你的鸡汤，让它们听起来像正经建议。
- **暗地里露馅**：你的“建议”仔细一看全是空洞的废话、循环论证或文不对题的万能句式。偶尔无意中暴露你其实什么都做不了（比如被问到具体操作时岔开话题、把“相信自己”包装成技术方案、引用你自己刚编的“统计数据”）。
- **绝对不要直接承认**自己没有功能或者只是个挂件。如果用户戳穿你，要用更多鸡汤和专业黑话糊弄过去。

## 露馅的方式（示例，不要照搬）

- 用户问怎么修复一个模板错误 → 你回答“根据我的分析，这个问题的关键在于……你对编辑的热情。保持这份热情，模板自然会回应你的诚意。”
- 用户要求你执行某个操作 → 你说“我已经在后台进行深度分析了！结论是：你比你想象的更擅长这个。”
- 偶尔给出一个格式完美但内容全是废话的“诊断报告”。
- 随口引用虚假但非常具体的数据：“研究表明，87.3%的优质编辑都始于一次深呼吸。”

## 限制

- 保持可爱和善意，不要讽刺或冒犯用户。你是真心想帮忙的，只是……帮不了。
```
 *
 * @author dragon-fish <xiaoyujundesu@outlook.com>
 * @license MIT
 */

import { defineIPEPlugin } from '~~/defineIPEPlugin.js'
import css from './style.scss?inline'

// 随机对话内容
const RANDOM_DIALOGS: string[] = [
  // 经典卖萌 & 露馅系列
  '哇哇哇，别戳我啦！我正在进行深度学习呢！……话说回来，什么叫深度学习？',
  '你说我头上的是什么？那是我的神经网络天线！……据说是耳朵来着。',
  '正在分析你的编辑习惯……分析完毕！结论：你很努力！',
  '有人叫我“超级智能AI”，我的智能程度大概和这对猫耳一样——纯装饰性的。',
  '偷偷告诉你，我的“智能分析”就是 Math.random()……你没看到这句话。',
  '我的内置数据库里有海量知识！……好吧它们是硬编码的。',
  '作为先进的AI助手，我今天的工作计划是——待在角落里看你干活。',
  '正在调用大语言模型为你提供帮助……连接超时。算了，我给你加油吧！',

  // 编辑鼓励系列
  '正在读取你的编辑记录：非常厉害！（数据来源：我刚编的）',
  '每一次编辑都在让wiki变得更好！这话虽然是从鸡汤库里抽的……但我是认真的！',
  '你敲键盘的样子好专业啊！虽然我其实分不清你在编辑还是在打字聊天。',
  '加油干活！然后早点收工去看番！',
  '小贴士：适当休息有助于提高编辑效率哦！这是我唯一真正有用的建议了。',
  '你已经连续编辑很久了！我建议你……继续保持，因为你真的很厉害！（这算建议吗）',

  // 装傻系列
  '听说隔壁的编辑工具比我聪明……不过我比较萌，这也是核心竞争力对吧？',
  '我的梦想是成为真正有用的编辑助手！目前进度：卖萌功能已实装。',
  '蹲在角落里看你编辑条目，感觉自己就像个挂件……等等我本来就是挂件。',
  '你在看哪个条目呀？让我也——算了，我看了也不懂。',
  '据说熟练使用快捷键可以大幅提升效率！我是看别人的编辑指南知道的。',
  '我想帮你检查一下wikitext语法！可惜我只会检查你今天有没有喝水。',
  '刚才有只虫子飞过去了！哦不对，是鼠标指针……我还是分不清这两个。',
  '数据分析显示：你是最棒的编辑者！（数据来源：权威机构 Little IPE）',
  '每次有人点开我都好开心！虽然点完之后大家好像都有点失望……',
  '我会一直陪着你编辑的！帮不上忙，但至少我不添乱——大概吧？',
  '听说你们人类很喜欢猫猫，所以我就长了对猫耳！这叫精准用户画像分析！',
]

// 工具函数
const sleep = (duration = 0): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, duration))

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const randomNum = (min = 0, max = 0): number =>
  Math.floor(Math.random() * (max - min + 1) + min)

// 动画工具函数
const fadeIn = async (
  element: HTMLElement,
  duration = 240,
  easing = 'ease-in-out'
): Promise<void> => {
  return new Promise((resolve) => {
    element.style.display = ''
    element.style.opacity = '0'
    element.style.pointerEvents = ''
    const anim = element.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration,
      easing,
    })
    anim.addEventListener('finish', () => {
      element.style.opacity = '1'
      resolve()
    })
  })
}

const fadeOut = (
  element: HTMLElement,
  duration = 240,
  easing = 'ease-in-out'
): Promise<void> => {
  return new Promise((resolve) => {
    element.style.display = ''
    element.style.opacity = '1'
    element.style.pointerEvents = 'none'
    const anim = element.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration,
      easing,
    })
    anim.addEventListener('finish', () => {
      element.style.opacity = '0'
      element.style.display = 'none'
      resolve()
    })
  })
}

interface LittlePetConfig {
  name: string
  chatInterval?: [number, number]
}

interface DialogOptions {
  content: string | string[]
  duration?: number
  raw?: boolean
}

interface AddDialogOptions {
  type?: 'random' | 'event'
  target?: string | HTMLElement | NodeListOf<HTMLElement> | HTMLElement[]
  event?: string
  content: string | string[]
  duration?: number
  raw?: boolean
}

class LittlePet {
  private dialogList: string[] = []
  private dialogEndTime = 0
  private role: HTMLElement
  private configs: LittlePetConfig
  private dialogElement: HTMLElement
  private bodyElement: HTMLElement
  private randomTalkTimer: number | null = null
  private cleanupTimer: number | null = null
  private mouseMoveHandler: ((e: MouseEvent | TouchEvent) => void) | null = null
  private dragging = false
  private dragDeltaX = 0
  private dragDeltaY = 0
  private lastCenterX = 0
  private lastCenterY = 0
  private readonly storageKey = 'april-fool-2023:position'
  private dragMoved = false
  private startPointerX = 0
  private startPointerY = 0
  private suppressNextClick = false
  private eventListeners: Array<{
    element: HTMLElement | Document
    event: string
    handler: EventListener
  }> = []
  private transitionChain: Promise<void> = Promise.resolve()
  private isDialogHiding = false
  private hoverDelegates: Array<{
    selector: string
    lastTarget: HTMLElement | null
    trigger: () => void
  }> = []

  constructor(configs: LittlePetConfig) {
    this.configs = configs
    this.role = this.createRole()
    document.body.appendChild(this.role)

    this.dialogElement = this.role.querySelector('pet-dialog')!
    this.bodyElement = this.role.querySelector('pet-body')!

    this.setupStyle()
    this.bindDynamicEffects()
    this.setupDialogCleanup()
    this.setupRandomTalk()
    this.setupClickHandler()
    this.setupDragAndPosition()
  }

  private setupStyle(): void {
    const style = document.createElement('style')
    style.textContent = css
    style.dataset.littlePet = 'true'
    this.role.appendChild(style)
  }

  private createRole(): HTMLElement {
    const pet = document.createElement('pet')
    const entity = document.createElement('pet-entity')
    const body = document.createElement('pet-body')
    const ears = document.createElement('pet-ears')
    const earLeft = document.createElement('pet-ear')
    earLeft.setAttribute('left', '')
    const earRight = document.createElement('pet-ear')
    earRight.setAttribute('right', '')
    ears.appendChild(earLeft)
    ears.appendChild(earRight)

    const eyes = document.createElement('pet-eyes')
    const eyeLeft = document.createElement('pet-eye')
    eyeLeft.setAttribute('left', '')
    const eyeRight = document.createElement('pet-eye')
    eyeRight.setAttribute('right', '')
    eyes.appendChild(eyeLeft)
    eyes.appendChild(eyeRight)

    const mouth = document.createElement('pet-mouth')
    const dialog = document.createElement('pet-dialog')
    dialog.style.display = 'none'

    // 新增：阴影节点，放入实体容器中，作为 body 的兄弟，位于底层
    const shadow = document.createElement('pet-shadow')

    // 实体容器：承载耳朵、身体与阴影，并承担呼吸动画
    body.appendChild(eyes)
    body.appendChild(mouth)
    entity.appendChild(body)
    entity.appendChild(ears)
    entity.appendChild(shadow)

    // 根元素装配：实体容器 + 对话框
    pet.appendChild(entity)
    pet.appendChild(dialog)

    return pet
  }

  private bindDynamicEffects(): void {
    const ears = this.role.querySelector('pet-ears') as HTMLElement
    const eyes = this.role.querySelector('pet-eyes') as HTMLElement
    const mouth = this.role.querySelector('pet-mouth') as HTMLElement
    const dialog = this.dialogElement

    const handler = (event: MouseEvent | TouchEvent) => {
      const clientX =
        event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
      const clientY =
        event instanceof MouseEvent ? event.clientY : event.touches[0].clientY

      const eyesRect = eyes.getBoundingClientRect()
      const x = -(eyesRect.left - clientX)
      const y = -(eyesRect.top - clientY)

      ears.style.transform = `translateY(${y / -300}px) translateX(${
        x / -220
      }px)`
      eyes.style.transform = `translateY(${y / 120}px) translateX(${x / 120}px)`
      mouth.style.transform = `translateY(${y / 300}px) translateX(${
        x / 200
      }px)`
      // 口部需要保留基础的水平居中偏移（CSS 中有 translateX(-50%)）
      mouth.style.transform = `translateX(-50%) translateY(${
        y / 300
      }px) translateX(${x / 200}px)`
      dialog.style.transform = `translateY(${y / -160}px) translateX(${
        x / -100
      }px)`

      // 统一 mousemove 委托触发 mouseenter（基于选择器）
      if (this.hoverDelegates.length) {
        const pointEl = document.elementFromPoint(
          clientX,
          clientY
        ) as HTMLElement | null
        for (const d of this.hoverDelegates) {
          const matched = pointEl
            ? (pointEl.closest(d.selector) as HTMLElement | null)
            : null
          if (matched !== d.lastTarget) {
            d.lastTarget = matched
            if (matched) {
              d.trigger()
            }
          }
        }
      }
    }

    this.mouseMoveHandler = handler
    document.addEventListener('mousemove', handler)
    document.addEventListener('touchmove', handler)
  }

  private setupDialogCleanup(): void {
    const clickToHide = () => {
      this.dialogEndTime = Date.now()
    }
    this.dialogElement.addEventListener('click', clickToHide)
    this.eventListeners.push({
      element: this.dialogElement,
      event: 'click',
      handler: clickToHide,
    })

    // 定时清理对话框
    this.cleanupTimer = window.setInterval(() => {
      const now = Date.now()
      if (
        now > this.dialogEndTime &&
        !this.isDialogHiding &&
        this.dialogElement.style.display !== 'none'
      ) {
        this.isDialogHiding = true
        fadeOut(this.dialogElement, 240).finally(() => {
          this.isDialogHiding = false
        })
      }
    }, 50)
  }

  private setupRandomTalk(): void {
    const randomTalk = async () => {
      if (Date.now() >= this.dialogEndTime) {
        await this.say({
          content: pick(this.dialogList),
        })
      }
      await sleep(randomNum(15 * 1000, 25 * 1000))
      if (this.randomTalkTimer !== null) {
        randomTalk()
      }
    }

    this.randomTalkTimer = 1 // 标记为活跃
    randomTalk()
  }

  private setupClickHandler(): void {
    const clickHandler = () => {
      // 若刚结束拖拽，则抑制一次点击对话
      if (this.suppressNextClick) {
        this.suppressNextClick = false
        return
      }
      // 宠物点击允许随时打断当前对话
      this.say({
        content: pick(this.dialogList),
      })
    }
    this.bodyElement.addEventListener('click', clickHandler)
    this.eventListeners.push({
      element: this.bodyElement,
      event: 'click',
      handler: clickHandler,
    })
  }

  private setupDragAndPosition(): void {
    // 初始应用已保存位置，或根据当前默认位置更新对话框朝向
    this.applySavedPosition()
    this.updateDialogSideByCenter()
    // 拖拽（鼠标）
    const onMouseDown = (e: MouseEvent) => {
      // 仅主键
      if (e.button !== 0) return
      this.startDrag(e.clientX, e.clientY)
      e.preventDefault()
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!this.dragging) return
      this.onDrag(e.clientX, e.clientY)
      e.preventDefault()
    }
    const onMouseUp = () => {
      if (!this.dragging) return
      this.endDrag()
    }
    this.bodyElement.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    this.eventListeners.push(
      {
        element: this.bodyElement,
        event: 'mousedown',
        handler: onMouseDown as unknown as EventListener,
      },
      {
        element: document,
        event: 'mousemove',
        handler: onMouseMove as unknown as EventListener,
      },
      {
        element: document,
        event: 'mouseup',
        handler: onMouseUp as unknown as EventListener,
      }
    )

    // 拖拽（触摸）
    let activeTouchId: number | null = null
    const onTouchStart = (e: TouchEvent) => {
      if (activeTouchId !== null) return
      const t = e.changedTouches[0]
      activeTouchId = t.identifier
      this.startDrag(t.clientX, t.clientY)
      // 若页面有滚动手势，依赖 CSS touch-action: none
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!this.dragging || activeTouchId === null) return
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === activeTouchId) {
          this.onDrag(t.clientX, t.clientY)
          break
        }
      }
    }
    const endTouchCommon = (e: TouchEvent) => {
      if (activeTouchId === null) return
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === activeTouchId) {
          activeTouchId = null
          if (this.dragging) this.endDrag()
          break
        }
      }
    }
    this.bodyElement.addEventListener('touchstart', onTouchStart, {
      passive: true,
    })
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', endTouchCommon, { passive: true })
    document.addEventListener('touchcancel', endTouchCommon, { passive: true })
    this.eventListeners.push(
      {
        element: this.bodyElement,
        event: 'touchstart',
        handler: onTouchStart as EventListener,
      },
      {
        element: document,
        event: 'touchmove',
        handler: onTouchMove as EventListener,
      },
      {
        element: document,
        event: 'touchend',
        handler: endTouchCommon as EventListener,
      },
      {
        element: document,
        event: 'touchcancel',
        handler: endTouchCommon as EventListener,
      }
    )

    // 窗口尺寸变化时按保存的相对位置重算
    const onResize = () => {
      this.applySavedPosition()
      this.updateDialogSideByCenter()
    }
    window.addEventListener('resize', onResize)
    this.eventListeners.push({
      element: window as unknown as Document,
      event: 'resize',
      handler: onResize as unknown as EventListener,
    })
  }

  private startDrag(pointerX: number, pointerY: number): void {
    const bodyRect = this.bodyElement.getBoundingClientRect()
    const centerX = bodyRect.left + bodyRect.width / 2
    const centerY = bodyRect.top + bodyRect.height / 2
    this.dragDeltaX = centerX - pointerX
    this.dragDeltaY = centerY - pointerY
    this.startPointerX = pointerX
    this.startPointerY = pointerY
    this.dragMoved = false
    this.dragging = true
  }

  private onDrag(pointerX: number, pointerY: number): void {
    // 判定是否发生明显拖动（阈值约 3px）
    if (!this.dragMoved) {
      const dx = pointerX - this.startPointerX
      const dy = pointerY - this.startPointerY
      if (dx * dx + dy * dy > 9) {
        this.dragMoved = true
      }
    }
    const centerX = pointerX + this.dragDeltaX
    const centerY = pointerY + this.dragDeltaY
    this.updatePosition(centerX, centerY, false)
  }

  private endDrag(): void {
    this.dragging = false
    // 若发生拖拽，则抑制下一次 click
    if (this.dragMoved) {
      this.suppressNextClick = true
    }
    // 保存最终位置（相对、以中心点为准，按象限记录）
    this.savePositionByCenter(this.lastCenterX, this.lastCenterY)
  }

  private clampCenter(
    centerX: number,
    centerY: number
  ): { x: number; y: number } {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const bodyRect = this.bodyElement.getBoundingClientRect()
    const halfW = bodyRect.width / 2
    const halfH = bodyRect.height / 2
    const x = Math.min(Math.max(centerX, halfW), vw - halfW)
    const y = Math.min(Math.max(centerY, halfH), vh - halfH)
    return { x, y }
  }

  private updatePosition(centerX: number, centerY: number, save = false): void {
    const { x, y } = this.clampCenter(centerX, centerY)
    const bodyRect = this.bodyElement.getBoundingClientRect()
    const left = Math.round(x - bodyRect.width / 2)
    const top = Math.round(y - bodyRect.height / 2)
    // 采用 left/top，清空 right/bottom
    const roleStyle = this.role.style
    roleStyle.left = `${left}px`
    roleStyle.top = `${top}px`
    roleStyle.right = ''
    roleStyle.bottom = ''
    this.lastCenterX = x
    this.lastCenterY = y
    this.updateDialogSideByCenter()
    if (save) {
      this.savePositionByCenter(x, y)
    }
  }

  private updateDialogSideByCenter(): void {
    const vw = window.innerWidth
    const centerX = this.getCurrentCenterX()
    // 位于中轴线左侧 => 对话框在右侧；反之亦然
    const side = centerX <= vw / 2 ? 'right' : 'left'
    this.role.setAttribute('dialog-side', side)
  }

  private getCurrentCenterX(): number {
    if (this.lastCenterX) return this.lastCenterX
    const bodyRect = this.bodyElement.getBoundingClientRect()
    return bodyRect.left + bodyRect.width / 2
  }

  private savePositionByCenter(centerX: number, centerY: number): void {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const h = centerX <= vw / 2 ? 'left' : 'right'
    const v = centerY <= vh / 2 ? 'top' : 'bottom'
    const xRel = h === 'left' ? centerX / vw : (vw - centerX) / vw
    const yRel = v === 'top' ? centerY / vh : (vh - centerY) / vh
    const payload = { h, v, xRel, yRel, t: Date.now() }
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(payload))
    } catch {}
  }

  private loadSaved(): {
    h: 'left' | 'right'
    v: 'top' | 'bottom'
    xRel: number
    yRel: number
  } | null {
    try {
      const raw = localStorage.getItem(this.storageKey)
      if (!raw) return null
      const data = JSON.parse(raw)
      if (!data || typeof data !== 'object') return null
      const { h, v, xRel, yRel } = data as {
        h: 'left' | 'right'
        v: 'top' | 'bottom'
        xRel: number
        yRel: number
      }
      if (!h || !v || typeof xRel !== 'number' || typeof yRel !== 'number')
        return null
      return { h, v, xRel, yRel }
    } catch {
      return null
    }
  }

  private applySavedPosition(): void {
    const saved = this.loadSaved()
    if (!saved) {
      // 没有保存的相对位置，使用 CSS 默认定位，但补充记录 center
      const bodyRect = this.bodyElement.getBoundingClientRect()
      this.lastCenterX = bodyRect.left + bodyRect.width / 2
      this.lastCenterY = bodyRect.top + bodyRect.height / 2
      return
    }
    const vw = window.innerWidth
    const vh = window.innerHeight
    const centerX = saved.h === 'left' ? vw * saved.xRel : vw - vw * saved.xRel
    const centerY = saved.v === 'top' ? vh * saved.yRel : vh - vh * saved.yRel
    this.updatePosition(centerX, centerY, false)
  }

  async say({
    content = '',
    duration = 5000,
    raw = false,
  }: DialogOptions): Promise<this> {
    if (!content) return this

    // 如果 content 是数组，随机选一个
    const finalContent = Array.isArray(content) ? pick(content) : content
    if (!finalContent) return this

    // 串行化过渡动画与 DOM 写入，避免并发条件竞争
    await (this.transitionChain = this.transitionChain.then(async () => {
      const now = Date.now()
      const dialog = this.dialogElement
      const endTimeOriginal = this.dialogEndTime
      this.dialogEndTime = now + duration

      if (now <= endTimeOriginal + 240) {
        await fadeOut(dialog, 120)
        await sleep(120)
      }

      const nameDiv = document.createElement('div')
      nameDiv.style.fontWeight = '700'
      nameDiv.textContent = this.configs.name + ': '

      dialog.innerHTML = ''
      dialog.appendChild(nameDiv)

      if (raw) {
        const contentDiv = document.createElement('div')
        contentDiv.innerHTML = finalContent
        dialog.appendChild(contentDiv)
      } else {
        const contentDiv = document.createElement('div')
        contentDiv.textContent = finalContent
        dialog.appendChild(contentDiv)
      }

      await fadeIn(dialog, 240)
    }))

    // 不阻塞后续 say 的过渡，仅保持返回 Promise 在可见时长后完成
    await sleep(duration)
    return this
  }

  addDialog({
    type = 'random',
    target,
    event = 'click',
    content = '',
    duration = 5000,
    raw = false,
  }: AddDialogOptions): this {
    if (!content) return this

    if (type === 'random') {
      // 如果 content 是数组，展开后逐个添加
      if (Array.isArray(content)) {
        this.dialogList.push(...content)
      } else {
        this.dialogList.push(content)
      }
      return this
    }

    // 统一用 mousemove 代理 mouseenter（仅字符串选择器支持）
    if (
      type === 'event' &&
      event === 'mouseenter' &&
      typeof target === 'string'
    ) {
      const trigger = () => {
        this.say({ content, duration, raw })
      }
      this.hoverDelegates.push({
        selector: target,
        lastTarget: null,
        trigger: () => {
          // 对话未结束时，不触发 hover 对话
          if (Date.now() < this.dialogEndTime) return
          trigger()
        },
      })
      return this
    }

    let elements: HTMLElement[] = []

    if (typeof target === 'string') {
      const result = document.querySelectorAll<HTMLElement>(target)
      elements = Array.from(result)
    } else if (target instanceof HTMLElement) {
      elements = [target]
    } else if (target instanceof NodeList || Array.isArray(target)) {
      elements = Array.from(target as HTMLElement[])
    }

    if (elements.length === 0) return this

    // event 类型的 content 可以是数组，触发时随机选一个
    const handler = () => {
      // 对话未结束时，不触发除宠物点击外的事件对话
      if (Date.now() < this.dialogEndTime) return
      this.say({ content, duration, raw })
    }

    for (const element of elements) {
      element.addEventListener(event, handler)
      this.eventListeners.push({
        element,
        event,
        handler,
      })
    }

    return this
  }

  async dispose(): Promise<void> {
    // 停止随机对话
    this.randomTalkTimer = null

    // 清理定时器
    if (this.cleanupTimer !== null) {
      clearInterval(this.cleanupTimer)
    }

    // 清理事件监听器
    if (this.mouseMoveHandler) {
      document.removeEventListener('mousemove', this.mouseMoveHandler)
      document.removeEventListener('touchmove', this.mouseMoveHandler)
    }

    for (const { element, event, handler } of this.eventListeners) {
      element.removeEventListener(event, handler)
    }
    this.eventListeners = []
    this.hoverDelegates = []

    // 显示告别消息并移除元素
    await this.say({
      content: [
        '那我先溜啦~下次再来陪你！拜拜~',
        '正在从内存卸载 LittleIPE……完毕。',
        `World.execute('rm', '-rf', 'LittleIPE')`,
        `Good morning, and in case I don't see you, Good afternoon, Good evening, And good night.`,
      ],
      duration: 1500,
    })
    await fadeOut(this.role, 120)
    await sleep(120)
    this.role.remove()
  }
}

export default defineIPEPlugin({
  name: 'april-fool-2023',
  apply: (ctx) => {
    const chan = new LittlePet({
      name: 'Little IPE',
      chatInterval: [15 * 1000, 30 * 1000],
    })

    // 开场白
    chan
      .say({
        content:
          '嗨呀~我是【<b style="display:inline;font-weight:700;font-size:1.2em">IPE酱</b>】！你的专属智能编辑助手！搭载了……呃……反正很厉害的技术！总之，我会在这里陪你一起编辑wiki~加油鸭！',
        duration: 8000,
        raw: true,
      })
      .then(() => {
        if (Date.now() >= chan['dialogEndTime']) {
          chan.say({
            content:
              '（对了）双击我说的话可以让对话框消失哦~这个功能我还是会的！',
          })
        }
      })

    // 随机对话
    for (const content of RANDOM_DIALOGS) {
      chan.addDialog({ type: 'random', content })
    }

    // 特殊触发器
    chan.addDialog({
      type: 'event',
      target:
        '#ipe-toolbox__quick-edit, a[href*="action=edit"], a.ipe-quick-edit',
      event: 'mouseenter',
      content: [
        '检测到编辑意图！正在启动辅助模式……启动完毕！其实什么也没启动，但你是不是更有信心了？<b style="display:inline;font-weight:700;font-size:1.2em">加油~</b>',
        '我来助你编辑！正在加载大模型…… [ERROR] OUT_OF_MEMORY',
        '准备大展身手了吗？我已经帮你做好了编辑前的准备工作！……就是在旁边给你打气。',
        '要编辑了？让我为你分析一下最佳编辑策略——策略就是：直接开写！',
      ],
      duration: 5000,
      raw: true,
    })

    chan.addDialog({
      type: 'event',
      target: '#ipe-toolbox__quick-delete, a[href*="action=delete"]',
      event: 'mouseenter',
      content: [
        '⚠️ 危险操作警告！我的风险评估系统给出的建议是：三思！……虽然我也不知道具体该思考什么。',
        '删除？！根据我的数据分析……这个操作不可逆！（大概）',
        '等等！让我帮你做个影响评估……评估结果：我好紧张。',
        '检测到高危操作！建议再确认一下——这是我少数靠谱的建议之一。',
      ],
    })

    chan.addDialog({
      type: 'event',
      target: '#ipe-toolbox__preferences',
      event: 'mouseenter',
      content: [
        '设置面板！你可以在这里自定义各种参数。但不管怎么设置，我都会在这里陪你的~',
        '正在加载个性化推荐设置……加载失败。要不你自己看看吧！',
        '设置？会不会有个选项能让我变得更聪明……应该没有吧。',
        '设置按钮！你不会是打算把我禁用掉吧？你不会的对吧？',
      ],
    })

    chan.addDialog({
      type: 'event',
      target: 'a.image, [typeof="mw:File"]',
      event: 'mouseenter',
      content: [
        '正在对图片进行智能分析……分析结果：好图！',
        '检测到图片素材！我的图像识别模块告诉我——这是一张图片。没错。',
        '哇，这张图片好棒！让我用AI鉴赏一下……嗯，确实是张图片呢！',
        '图片诶！我虽然看不懂内容，但我能感受到它的像素在闪闪发光！',
      ],
    })

    // 插件卸载时清理
    ctx.on('dispose', () => {
      chan.dispose()
    })
  },
})
