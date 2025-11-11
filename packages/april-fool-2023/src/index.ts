/**
 * My Little IPE 小小IPE酱
 * @author dragon-fish <xiaoyujundesu@outlook.com>
 * @license MIT
 */

import { defineIPEPlugin } from '~~/defineIPEPlugin.js'
import css from './style.scss?inline'

// 随机对话内容
const RANDOM_DIALOGS: string[] = [
  '哇哇哇，别戳我啦！',
  '你说我头上的是什么？据说是耳朵……大概吧？',
  '嘿~需要帮忙编辑页面吗？虽然我也不知道能帮上什么……',
  '今天天气不错呢！咦，等等，我好像看不到窗外……',
  '我刚才在想什么来着？算了，不重要！',
  '有人叫我"超级智能AI"，其实我就是个会说话的馒头（小声）',
  '诶，你在编辑Wiki吗？加油加油！我在旁边给你加油！',
  '听说隔壁的插件比我聪明……不过我比较可爱，对吧？',
  '我的梦想是成为真正有用的助手！现在嘛……还在努力中~',
  '有时候我也搞不清楚自己在说什么，但没关系，氛围到位就行！',
  '蹲在这个角落里看你工作，感觉自己像个吉祥物~',
  '刚才有只虫子飞过去了！哦不对，是鼠标指针……',
  '据说熟练使用快捷键会很厉害！我是听别人说的。',
  '偷偷告诉你，我其实不太懂什么是机器学习……但听起来很厉害对吧！',
  '嘿嘿，我就静静地待在这里，不给你添乱~',
  '要不要休息一下？盯着屏幕太久对眼睛不好哦！',
  '我想学着帮你做点什么，但好像除了卖萌也做不了别的……',
  '每次看到你敲键盘的样子就觉得好厉害啊！',
  '咦，那个按钮是干什么用的？算了，还是别乱碰……',
  '我会一直陪着你的！虽然帮不上什么大忙就是了。',
  '有BUG的话不是我的问题哦！大概……也许……可能吧？',
  '作为一个"AI助手"，我决定今天就静静待着不捣乱！',
  '听说你们人类很喜欢猫猫，所以我长了对猫耳！机智吧~',
  '加油干活！然后早点下班去吃好吃的！',
  '我在角落里给你念波心灵鸡汤：你是最棒的！（虽然我也不知道有没有用）',
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
      content: '那我先溜啦~下次再来陪你！拜拜~',
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
          '嗨呀~我是【<b style="display:inline;font-weight:700;font-size:1.2em">IPE酱</b>】！一只会说话的……咳咳，我是说，一个超级智能的 AI 助手！（虽然实际上就是蹲在角落里卖萌）总之，希望能陪你一起编辑 Wiki，加油鸭~',
        duration: 8000,
        raw: true,
      })
      .then(() => {
        if (Date.now() >= chan['dialogEndTime']) {
          chan.say({
            content: '（对了）双击我说的话可以让对话框消失哦~',
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
      target: '#ipe-toolbox__quick-edit, a[href*="action=edit"]',
      event: 'mouseenter',
      content: [
        '要编辑页面吗？emmm……其实我帮不上什么忙，但我可以在旁边默默给你打气！<b style="display:inline;font-weight:700;font-size:1.2em">加油加油~</b>',
        '编辑按钮诶！虽然我不会编辑，但我会给你精神支持！',
        '准备大展身手了吗？我就在这里看着你哦~',
        '要改页面啦？我……我就在角落里默默支持你！',
      ],
      duration: 5000,
      raw: true,
    })

    chan.addDialog({
      type: 'event',
      target: '#ipe-toolbox__quick-delete, a[href*="action=delete"]',
      event: 'mouseenter',
      content: [
        '咦？删除按钮诶……要三思而后行哦！（虽然我也不知道该怎么三思）',
        '删除？！这个操作好像很危险的样子……',
        '等等！你确定要删吗？我有点紧张……',
        '这是删除按钮吗？要小心哦！删了就找不回来了！大概！',
      ],
    })

    chan.addDialog({
      type: 'event',
      target: '#ipe-toolbox__preferences',
      event: 'mouseenter',
      content: [
        '这个是设置按钮！但不管你怎么设置，我都会在这里陪你的~',
        '设置？会不会把我也设置没了……应该不会吧？',
        '看起来是个很重要的按钮呢！',
        '调整设置可以让编辑更方便哦！我猜的~',
      ],
    })

    chan.addDialog({
      type: 'event',
      target: 'a.image',
      event: 'mouseenter',
      content: [
        '哇！图片诶！看起来好厉害的样子！',
        '这张图片好好看！是你上传的吗？',
        '图图！让我也康康！',
        '诶嘿，发现了一张有趣的图片~',
      ],
    })

    // 插件卸载时清理
    ctx.on('dispose', () => {
      chan.dispose()
    })
  },
})
