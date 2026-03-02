const v = () => {
  let r, e;
  return { promise: new Promise((n, i) => {
    r = n, e = i;
  }), resolve: r, reject: e };
};
Promise.withResolvers || (Promise.withResolvers = v);
const b = (r) => r, w = '@charset "UTF-8";pet{position:fixed;font-size:12px;left:3em;bottom:3em;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;z-index:1000}pet,pet-entity,pet-body,pet-ears,pet-ear,pet-eyes,pet-eye,pet-mouth,pet-dialog{display:block;box-sizing:border-box}@media(max-width:750px){pet{font-size:10px}}pet-entity{position:relative;transform-origin:50% 100%;animation:pet-breathe 6s ease infinite;will-change:transform;z-index:0}pet-body{position:relative;width:6em;height:4.5em;background-color:#2584ff;background-image:radial-gradient(farthest-corner at 3.5em .4em,#6bbdff,#0165ff 60%,#0165ff);border-radius:5em 5em 2.5em 2.5em;z-index:1;cursor:grab;touch-action:none}pet-body:active{cursor:grabbing}pet-shadow{position:absolute;content:"";width:125%;height:40%;border-radius:50%;left:-10%;bottom:-20%;background-color:#00000059;filter:blur(5px);z-index:0;pointer-events:none}pet-ears{position:absolute;top:-.4em;width:100%;z-index:0}pet-ear{position:absolute;width:1.8em;height:2em;background-color:#0165ff;background-image:radial-gradient(farthest-corner at 1.6em 0em,#49adfe,#0f6efd 60%,#0f6efd);border-top-left-radius:3.34em 3em;border-top-right-radius:.5em .75em}pet-ear[left]{left:3%;transform:rotate(-60deg)}pet-ear[right]{right:3%;transform:rotate(60deg) scaleX(-1)}pet-eyes{position:absolute;top:1.8em;left:0;width:100%}pet-eye{position:absolute;top:0;width:.6em;height:1.35em;border-radius:100vw;background-color:#ffab00;background-image:radial-gradient(farthest-corner at .35em .4em,#facc6f,#d79510 75%);transform:translateY(-50%);animation:pet-wink 3.2s ease infinite}pet-eye[left]{left:25%}pet-eye[right]{right:25%}pet-mouth{position:absolute;bottom:25%;left:50%;transform:translate(-50%)}pet-mouth:before,pet-mouth:after{content:"";position:absolute;bottom:0;display:block;width:.7em;height:.6em;border:1px solid transparent;border-bottom:1px solid #fff;border-radius:50%}pet-mouth:before{right:-1.5px}pet-mouth:after{left:-1.5px}pet-dialog{position:absolute;left:var(--pet-dialog-offset, 6em);bottom:calc(100% - 1em);background-color:#ffffffe6;border:.2em solid #4d9fea;box-shadow:0 0 1em #0000001a;color:#252525;padding:.8em;border-radius:.5em;width:24em;max-width:calc(100vw - 10em);font-size:1.12em;line-height:1.6;z-index:-2;cursor:pointer}pet[dialog-side=left] pet-dialog{right:var(--pet-dialog-offset, 6em);left:auto}pet[dialog-side=right] pet-dialog{left:var(--pet-dialog-offset, 6em);right:auto}@keyframes pet-breathe{0%{transform:scaleY(1)}20%{transform:scaleY(.89)}50%{transform:scaleY(1)}}@keyframes pet-wink{0%{height:1.35em}4%{height:2px}6%{height:1.35em}}', E = [
  // 经典卖萌 & 露馅系列
  "哇哇哇，别戳我啦！我正在进行深度学习呢！……话说回来，什么叫深度学习？",
  "你说我头上的是什么？那是我的神经网络天线！……据说是耳朵来着。",
  "正在分析你的编辑习惯……分析完毕！结论：你很努力！",
  "有人叫我“超级智能AI”，我的智能程度大概和这对猫耳一样——纯装饰性的。",
  "偷偷告诉你，我的“智能分析”就是 Math.random()……你没看到这句话。",
  "我的内置数据库里有海量知识！……好吧它们是硬编码的。",
  "作为先进的AI助手，我今天的工作计划是——待在角落里看你干活。",
  "正在调用大语言模型为你提供帮助……连接超时。算了，我给你加油吧！",
  // 编辑鼓励系列
  "正在读取你的编辑记录：非常厉害！（数据来源：我刚编的）",
  "每一次编辑都在让wiki变得更好！这话虽然是从鸡汤库里抽的……但我是认真的！",
  "你敲键盘的样子好专业啊！虽然我其实分不清你在编辑还是在打字聊天。",
  "加油干活！然后早点收工去看番！",
  "小贴士：适当休息有助于提高编辑效率哦！这是我唯一真正有用的建议了。",
  "你已经连续编辑很久了！我建议你……继续保持，因为你真的很厉害！（这算建议吗）",
  // 装傻系列
  "听说隔壁的编辑工具比我聪明……不过我比较萌，这也是核心竞争力对吧？",
  "我的梦想是成为真正有用的编辑助手！目前进度：卖萌功能已实装。",
  "蹲在角落里看你编辑条目，感觉自己就像个挂件……等等我本来就是挂件。",
  "你在看哪个条目呀？让我也——算了，我看了也不懂。",
  "据说熟练使用快捷键可以大幅提升效率！我是看别人的编辑指南知道的。",
  "我想帮你检查一下wikitext语法！可惜我只会检查你今天有没有喝水。",
  "刚才有只虫子飞过去了！哦不对，是鼠标指针……我还是分不清这两个。",
  "数据分析显示：你是最棒的编辑者！（数据来源：权威机构 Little IPE）",
  "每次有人点开我都好开心！虽然点完之后大家好像都有点失望……",
  "我会一直陪着你编辑的！帮不上忙，但至少我不添乱——大概吧？",
  "听说你们人类很喜欢猫猫，所以我就长了对猫耳！这叫精准用户画像分析！"
], p = (r = 0) => new Promise((e) => setTimeout(e, r)), g = (r) => r[Math.floor(Math.random() * r.length)], C = (r = 0, e = 0) => Math.floor(Math.random() * (e - r + 1) + r), x = async (r, e = 240, t = "ease-in-out") => new Promise((n) => {
  r.style.display = "", r.style.opacity = "0", r.style.pointerEvents = "", r.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: e,
    easing: t
  }).addEventListener("finish", () => {
    r.style.opacity = "1", n();
  });
}), y = (r, e = 240, t = "ease-in-out") => new Promise((n) => {
  r.style.display = "", r.style.opacity = "1", r.style.pointerEvents = "none", r.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: e,
    easing: t
  }).addEventListener("finish", () => {
    r.style.opacity = "0", r.style.display = "none", n();
  });
});
class D {
  constructor(e) {
    this.dialogList = [], this.dialogEndTime = 0, this.randomTalkTimer = null, this.cleanupTimer = null, this.mouseMoveHandler = null, this.dragging = !1, this.dragDeltaX = 0, this.dragDeltaY = 0, this.lastCenterX = 0, this.lastCenterY = 0, this.storageKey = "april-fool-2023:position", this.dragMoved = !1, this.startPointerX = 0, this.startPointerY = 0, this.suppressNextClick = !1, this.eventListeners = [], this.transitionChain = Promise.resolve(), this.isDialogHiding = !1, this.hoverDelegates = [], this.configs = e, this.role = this.createRole(), document.body.appendChild(this.role), this.dialogElement = this.role.querySelector("pet-dialog"), this.bodyElement = this.role.querySelector("pet-body"), this.setupStyle(), this.bindDynamicEffects(), this.setupDialogCleanup(), this.setupRandomTalk(), this.setupClickHandler(), this.setupDragAndPosition();
  }
  setupStyle() {
    const e = document.createElement("style");
    e.textContent = w, e.dataset.littlePet = "true", this.role.appendChild(e);
  }
  createRole() {
    const e = document.createElement("pet"), t = document.createElement("pet-entity"), n = document.createElement("pet-body"), i = document.createElement("pet-ears"), a = document.createElement("pet-ear");
    a.setAttribute("left", "");
    const o = document.createElement("pet-ear");
    o.setAttribute("right", ""), i.appendChild(a), i.appendChild(o);
    const l = document.createElement("pet-eyes"), d = document.createElement("pet-eye");
    d.setAttribute("left", "");
    const s = document.createElement("pet-eye");
    s.setAttribute("right", ""), l.appendChild(d), l.appendChild(s);
    const h = document.createElement("pet-mouth"), c = document.createElement("pet-dialog");
    c.style.display = "none";
    const m = document.createElement("pet-shadow");
    return n.appendChild(l), n.appendChild(h), t.appendChild(n), t.appendChild(i), t.appendChild(m), e.appendChild(t), e.appendChild(c), e;
  }
  bindDynamicEffects() {
    const e = this.role.querySelector("pet-ears"), t = this.role.querySelector("pet-eyes"), n = this.role.querySelector("pet-mouth"), i = this.dialogElement, a = (o) => {
      const l = o instanceof MouseEvent ? o.clientX : o.touches[0].clientX, d = o instanceof MouseEvent ? o.clientY : o.touches[0].clientY, s = t.getBoundingClientRect(), h = -(s.left - l), c = -(s.top - d);
      if (e.style.transform = `translateY(${c / -300}px) translateX(${h / -220}px)`, t.style.transform = `translateY(${c / 120}px) translateX(${h / 120}px)`, n.style.transform = `translateY(${c / 300}px) translateX(${h / 200}px)`, n.style.transform = `translateX(-50%) translateY(${c / 300}px) translateX(${h / 200}px)`, i.style.transform = `translateY(${c / -160}px) translateX(${h / -100}px)`, this.hoverDelegates.length) {
        const m = document.elementFromPoint(
          l,
          d
        );
        for (const u of this.hoverDelegates) {
          const f = m ? m.closest(u.selector) : null;
          f !== u.lastTarget && (u.lastTarget = f, f && u.trigger());
        }
      }
    };
    this.mouseMoveHandler = a, document.addEventListener("mousemove", a), document.addEventListener("touchmove", a);
  }
  setupDialogCleanup() {
    const e = () => {
      this.dialogEndTime = Date.now();
    };
    this.dialogElement.addEventListener("click", e), this.eventListeners.push({
      element: this.dialogElement,
      event: "click",
      handler: e
    }), this.cleanupTimer = window.setInterval(() => {
      Date.now() > this.dialogEndTime && !this.isDialogHiding && this.dialogElement.style.display !== "none" && (this.isDialogHiding = !0, y(this.dialogElement, 240).finally(() => {
        this.isDialogHiding = !1;
      }));
    }, 50);
  }
  setupRandomTalk() {
    const e = async () => {
      Date.now() >= this.dialogEndTime && await this.say({
        content: g(this.dialogList)
      }), await p(C(15e3, 25e3)), this.randomTalkTimer !== null && e();
    };
    this.randomTalkTimer = 1, e();
  }
  setupClickHandler() {
    const e = () => {
      if (this.suppressNextClick) {
        this.suppressNextClick = !1;
        return;
      }
      this.say({
        content: g(this.dialogList)
      });
    };
    this.bodyElement.addEventListener("click", e), this.eventListeners.push({
      element: this.bodyElement,
      event: "click",
      handler: e
    });
  }
  setupDragAndPosition() {
    this.applySavedPosition(), this.updateDialogSideByCenter();
    const e = (s) => {
      s.button === 0 && (this.startDrag(s.clientX, s.clientY), s.preventDefault());
    }, t = (s) => {
      this.dragging && (this.onDrag(s.clientX, s.clientY), s.preventDefault());
    }, n = () => {
      this.dragging && this.endDrag();
    };
    this.bodyElement.addEventListener("mousedown", e), document.addEventListener("mousemove", t), document.addEventListener("mouseup", n), this.eventListeners.push(
      {
        element: this.bodyElement,
        event: "mousedown",
        handler: e
      },
      {
        element: document,
        event: "mousemove",
        handler: t
      },
      {
        element: document,
        event: "mouseup",
        handler: n
      }
    );
    let i = null;
    const a = (s) => {
      if (i !== null) return;
      const h = s.changedTouches[0];
      i = h.identifier, this.startDrag(h.clientX, h.clientY);
    }, o = (s) => {
      if (!(!this.dragging || i === null)) {
        for (const h of Array.from(s.changedTouches))
          if (h.identifier === i) {
            this.onDrag(h.clientX, h.clientY);
            break;
          }
      }
    }, l = (s) => {
      if (i !== null) {
        for (const h of Array.from(s.changedTouches))
          if (h.identifier === i) {
            i = null, this.dragging && this.endDrag();
            break;
          }
      }
    };
    this.bodyElement.addEventListener("touchstart", a, {
      passive: !0
    }), document.addEventListener("touchmove", o, { passive: !0 }), document.addEventListener("touchend", l, { passive: !0 }), document.addEventListener("touchcancel", l, { passive: !0 }), this.eventListeners.push(
      {
        element: this.bodyElement,
        event: "touchstart",
        handler: a
      },
      {
        element: document,
        event: "touchmove",
        handler: o
      },
      {
        element: document,
        event: "touchend",
        handler: l
      },
      {
        element: document,
        event: "touchcancel",
        handler: l
      }
    );
    const d = () => {
      this.applySavedPosition(), this.updateDialogSideByCenter();
    };
    window.addEventListener("resize", d), this.eventListeners.push({
      element: window,
      event: "resize",
      handler: d
    });
  }
  startDrag(e, t) {
    const n = this.bodyElement.getBoundingClientRect(), i = n.left + n.width / 2, a = n.top + n.height / 2;
    this.dragDeltaX = i - e, this.dragDeltaY = a - t, this.startPointerX = e, this.startPointerY = t, this.dragMoved = !1, this.dragging = !0;
  }
  onDrag(e, t) {
    if (!this.dragMoved) {
      const a = e - this.startPointerX, o = t - this.startPointerY;
      a * a + o * o > 9 && (this.dragMoved = !0);
    }
    const n = e + this.dragDeltaX, i = t + this.dragDeltaY;
    this.updatePosition(n, i, !1);
  }
  endDrag() {
    this.dragging = !1, this.dragMoved && (this.suppressNextClick = !0), this.savePositionByCenter(this.lastCenterX, this.lastCenterY);
  }
  clampCenter(e, t) {
    const n = window.innerWidth, i = window.innerHeight, a = this.bodyElement.getBoundingClientRect(), o = a.width / 2, l = a.height / 2, d = Math.min(Math.max(e, o), n - o), s = Math.min(Math.max(t, l), i - l);
    return { x: d, y: s };
  }
  updatePosition(e, t, n = !1) {
    const { x: i, y: a } = this.clampCenter(e, t), o = this.bodyElement.getBoundingClientRect(), l = Math.round(i - o.width / 2), d = Math.round(a - o.height / 2), s = this.role.style;
    s.left = `${l}px`, s.top = `${d}px`, s.right = "", s.bottom = "", this.lastCenterX = i, this.lastCenterY = a, this.updateDialogSideByCenter(), n && this.savePositionByCenter(i, a);
  }
  updateDialogSideByCenter() {
    const e = window.innerWidth, n = this.getCurrentCenterX() <= e / 2 ? "right" : "left";
    this.role.setAttribute("dialog-side", n);
  }
  getCurrentCenterX() {
    if (this.lastCenterX) return this.lastCenterX;
    const e = this.bodyElement.getBoundingClientRect();
    return e.left + e.width / 2;
  }
  savePositionByCenter(e, t) {
    const n = window.innerWidth, i = window.innerHeight, a = e <= n / 2 ? "left" : "right", o = t <= i / 2 ? "top" : "bottom", l = a === "left" ? e / n : (n - e) / n, d = o === "top" ? t / i : (i - t) / i, s = { h: a, v: o, xRel: l, yRel: d, t: Date.now() };
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(s));
    } catch {
    }
  }
  loadSaved() {
    try {
      const e = localStorage.getItem(this.storageKey);
      if (!e) return null;
      const t = JSON.parse(e);
      if (!t || typeof t != "object") return null;
      const { h: n, v: i, xRel: a, yRel: o } = t;
      return !n || !i || typeof a != "number" || typeof o != "number" ? null : { h: n, v: i, xRel: a, yRel: o };
    } catch {
      return null;
    }
  }
  applySavedPosition() {
    const e = this.loadSaved();
    if (!e) {
      const o = this.bodyElement.getBoundingClientRect();
      this.lastCenterX = o.left + o.width / 2, this.lastCenterY = o.top + o.height / 2;
      return;
    }
    const t = window.innerWidth, n = window.innerHeight, i = e.h === "left" ? t * e.xRel : t - t * e.xRel, a = e.v === "top" ? n * e.yRel : n - n * e.yRel;
    this.updatePosition(i, a, !1);
  }
  async say({
    content: e = "",
    duration: t = 5e3,
    raw: n = !1
  }) {
    if (!e) return this;
    const i = Array.isArray(e) ? g(e) : e;
    return i ? (await (this.transitionChain = this.transitionChain.then(async () => {
      const a = Date.now(), o = this.dialogElement, l = this.dialogEndTime;
      this.dialogEndTime = a + t, a <= l + 240 && (await y(o, 120), await p(120));
      const d = document.createElement("div");
      if (d.style.fontWeight = "700", d.textContent = this.configs.name + ": ", o.innerHTML = "", o.appendChild(d), n) {
        const s = document.createElement("div");
        s.innerHTML = i, o.appendChild(s);
      } else {
        const s = document.createElement("div");
        s.textContent = i, o.appendChild(s);
      }
      await x(o, 240);
    })), await p(t), this) : this;
  }
  addDialog({
    type: e = "random",
    target: t,
    event: n = "click",
    content: i = "",
    duration: a = 5e3,
    raw: o = !1
  }) {
    if (!i) return this;
    if (e === "random")
      return Array.isArray(i) ? this.dialogList.push(...i) : this.dialogList.push(i), this;
    if (e === "event" && n === "mouseenter" && typeof t == "string") {
      const s = () => {
        this.say({ content: i, duration: a, raw: o });
      };
      return this.hoverDelegates.push({
        selector: t,
        lastTarget: null,
        trigger: () => {
          Date.now() < this.dialogEndTime || s();
        }
      }), this;
    }
    let l = [];
    if (typeof t == "string") {
      const s = document.querySelectorAll(t);
      l = Array.from(s);
    } else t instanceof HTMLElement ? l = [t] : (t instanceof NodeList || Array.isArray(t)) && (l = Array.from(t));
    if (l.length === 0) return this;
    const d = () => {
      Date.now() < this.dialogEndTime || this.say({ content: i, duration: a, raw: o });
    };
    for (const s of l)
      s.addEventListener(n, d), this.eventListeners.push({
        element: s,
        event: n,
        handler: d
      });
    return this;
  }
  async dispose() {
    this.randomTalkTimer = null, this.cleanupTimer !== null && clearInterval(this.cleanupTimer), this.mouseMoveHandler && (document.removeEventListener("mousemove", this.mouseMoveHandler), document.removeEventListener("touchmove", this.mouseMoveHandler));
    for (const { element: e, event: t, handler: n } of this.eventListeners)
      e.removeEventListener(t, n);
    this.eventListeners = [], this.hoverDelegates = [], await this.say({
      content: [
        "那我先溜啦~下次再来陪你！拜拜~",
        "正在从内存卸载 LittleIPE……完毕。",
        "World.execute('rm', '-rf', 'LittleIPE')",
        "Good morning, and in case I don't see you, Good afternoon, Good evening, And good night."
      ],
      duration: 1500
    }), await y(this.role, 120), await p(120), this.role.remove();
  }
}
const k = b({
  name: "april-fool-2023",
  apply: (r) => {
    const e = new D({
      name: "Little IPE",
      chatInterval: [15e3, 3e4]
    });
    e.say({
      content: '嗨呀~我是【<b style="display:inline;font-weight:700;font-size:1.2em">IPE酱</b>】！你的专属智能编辑助手！搭载了……呃……反正很厉害的技术！总之，我会在这里陪你一起编辑wiki~加油鸭！',
      duration: 8e3,
      raw: !0
    }).then(() => {
      Date.now() >= e.dialogEndTime && e.say({
        content: "（对了）双击我说的话可以让对话框消失哦~这个功能我还是会的！"
      });
    });
    for (const t of E)
      e.addDialog({ type: "random", content: t });
    e.addDialog({
      type: "event",
      target: '#ipe-toolbox__quick-edit, a[href*="action=edit"], a.ipe-quick-edit',
      event: "mouseenter",
      content: [
        '检测到编辑意图！正在启动辅助模式……启动完毕！其实什么也没启动，但你是不是更有信心了？<b style="display:inline;font-weight:700;font-size:1.2em">加油~</b>',
        "我来助你编辑！正在加载大模型…… [ERROR] OUT_OF_MEMORY",
        "准备大展身手了吗？我已经帮你做好了编辑前的准备工作！……就是在旁边给你打气。",
        "要编辑了？让我为你分析一下最佳编辑策略——策略就是：直接开写！"
      ],
      duration: 5e3,
      raw: !0
    }), e.addDialog({
      type: "event",
      target: '#ipe-toolbox__quick-delete, a[href*="action=delete"]',
      event: "mouseenter",
      content: [
        "⚠️ 危险操作警告！我的风险评估系统给出的建议是：三思！……虽然我也不知道具体该思考什么。",
        "删除？！根据我的数据分析……这个操作不可逆！（大概）",
        "等等！让我帮你做个影响评估……评估结果：我好紧张。",
        "检测到高危操作！建议再确认一下——这是我少数靠谱的建议之一。"
      ]
    }), e.addDialog({
      type: "event",
      target: "#ipe-toolbox__preferences",
      event: "mouseenter",
      content: [
        "设置面板！你可以在这里自定义各种参数。但不管怎么设置，我都会在这里陪你的~",
        "正在加载个性化推荐设置……加载失败。要不你自己看看吧！",
        "设置？会不会有个选项能让我变得更聪明……应该没有吧。",
        "设置按钮！你不会是打算把我禁用掉吧？你不会的对吧？"
      ]
    }), e.addDialog({
      type: "event",
      target: 'a.image, [typeof="mw:File"]',
      event: "mouseenter",
      content: [
        "正在对图片进行智能分析……分析结果：好图！",
        "检测到图片素材！我的图像识别模块告诉我——这是一张图片。没错。",
        "哇，这张图片好棒！让我用AI鉴赏一下……嗯，确实是张图片呢！",
        "图片诶！我虽然看不懂内容，但我能感受到它的像素在闪闪发光！"
      ]
    }), r.on("dispose", () => {
      e.dispose();
    });
  }
});
export {
  k as default
};
//# sourceMappingURL=index.mjs.map
