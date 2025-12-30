const v = () => {
  let r, e;
  return { promise: new Promise((n, i) => {
    r = n, e = i;
  }), resolve: r, reject: e };
};
Promise.withResolvers || (Promise.withResolvers = v);
const b = (r) => r, w = '@charset "UTF-8";pet{position:fixed;font-size:12px;left:3em;bottom:3em;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;z-index:1000}pet,pet-entity,pet-body,pet-ears,pet-ear,pet-eyes,pet-eye,pet-mouth,pet-dialog{display:block;box-sizing:border-box}@media(max-width:750px){pet{font-size:10px}}pet-entity{position:relative;transform-origin:50% 100%;animation:pet-breathe 6s ease infinite;will-change:transform;z-index:0}pet-body{position:relative;width:6em;height:4.5em;background-color:#2584ff;background-image:radial-gradient(farthest-corner at 3.5em .4em,#6bbdff,#0165ff 60%,#0165ff);border-radius:5em 5em 2.5em 2.5em;z-index:1;cursor:grab;touch-action:none}pet-body:active{cursor:grabbing}pet-shadow{position:absolute;content:"";width:125%;height:40%;border-radius:50%;left:-10%;bottom:-20%;background-color:#00000059;filter:blur(5px);z-index:0;pointer-events:none}pet-ears{position:absolute;top:-.4em;width:100%;z-index:0}pet-ear{position:absolute;width:1.8em;height:2em;background-color:#0165ff;background-image:radial-gradient(farthest-corner at 1.6em 0em,#49adfe,#0f6efd 60%,#0f6efd);border-top-left-radius:3.34em 3em;border-top-right-radius:.5em .75em}pet-ear[left]{left:3%;transform:rotate(-60deg)}pet-ear[right]{right:3%;transform:rotate(60deg) scaleX(-1)}pet-eyes{position:absolute;top:1.8em;left:0;width:100%}pet-eye{position:absolute;top:0;width:.6em;height:1.35em;border-radius:100vw;background-color:#ffab00;background-image:radial-gradient(farthest-corner at .35em .4em,#facc6f,#d79510 75%);transform:translateY(-50%);animation:pet-wink 3.2s ease infinite}pet-eye[left]{left:25%}pet-eye[right]{right:25%}pet-mouth{position:absolute;bottom:25%;left:50%;transform:translate(-50%)}pet-mouth:before,pet-mouth:after{content:"";position:absolute;bottom:0;display:block;width:.7em;height:.6em;border:1px solid transparent;border-bottom:1px solid #fff;border-radius:50%}pet-mouth:before{right:-1.5px}pet-mouth:after{left:-1.5px}pet-dialog{position:absolute;left:var(--pet-dialog-offset, 6em);bottom:calc(100% - 1em);background-color:#ffffffe6;border:.2em solid #4d9fea;box-shadow:0 0 1em #0000001a;color:#252525;padding:.8em;border-radius:.5em;width:24em;max-width:calc(100vw - 10em);font-size:1.12em;line-height:1.6;z-index:-2;cursor:pointer}pet[dialog-side=left] pet-dialog{right:var(--pet-dialog-offset, 6em);left:auto}pet[dialog-side=right] pet-dialog{left:var(--pet-dialog-offset, 6em);right:auto}@keyframes pet-breathe{0%{transform:scaleY(1)}20%{transform:scaleY(.89)}50%{transform:scaleY(1)}}@keyframes pet-wink{0%{height:1.35em}4%{height:2px}6%{height:1.35em}}', E = [
  "哇哇哇，别戳我啦！",
  "你说我头上的是什么？据说是耳朵……大概吧？",
  "嘿~需要帮忙编辑页面吗？虽然我也不知道能帮上什么……",
  "今天天气不错呢！咦，等等，我好像看不到窗外……",
  "我刚才在想什么来着？算了，不重要！",
  '有人叫我"超级智能AI"，其实我就是个会说话的馒头（小声）',
  "诶，你在编辑Wiki吗？加油加油！我在旁边给你加油！",
  "听说隔壁的插件比我聪明……不过我比较可爱，对吧？",
  "我的梦想是成为真正有用的助手！现在嘛……还在努力中~",
  "有时候我也搞不清楚自己在说什么，但没关系，氛围到位就行！",
  "蹲在这个角落里看你工作，感觉自己像个吉祥物~",
  "刚才有只虫子飞过去了！哦不对，是鼠标指针……",
  "据说熟练使用快捷键会很厉害！我是听别人说的。",
  "偷偷告诉你，我其实不太懂什么是机器学习……但听起来很厉害对吧！",
  "嘿嘿，我就静静地待在这里，不给你添乱~",
  "要不要休息一下？盯着屏幕太久对眼睛不好哦！",
  "我想学着帮你做点什么，但好像除了卖萌也做不了别的……",
  "每次看到你敲键盘的样子就觉得好厉害啊！",
  "咦，那个按钮是干什么用的？算了，还是别乱碰……",
  "我会一直陪着你的！虽然帮不上什么大忙就是了。",
  "有BUG的话不是我的问题哦！大概……也许……可能吧？",
  '作为一个"AI助手"，我决定今天就静静待着不捣乱！',
  "听说你们人类很喜欢猫猫，所以我长了对猫耳！机智吧~",
  "加油干活！然后早点下班去吃好吃的！",
  "我在角落里给你念波心灵鸡汤：你是最棒的！（虽然我也不知道有没有用）"
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
    const s = document.createElement("pet-ear");
    s.setAttribute("right", ""), i.appendChild(a), i.appendChild(s);
    const l = document.createElement("pet-eyes"), d = document.createElement("pet-eye");
    d.setAttribute("left", "");
    const o = document.createElement("pet-eye");
    o.setAttribute("right", ""), l.appendChild(d), l.appendChild(o);
    const h = document.createElement("pet-mouth"), c = document.createElement("pet-dialog");
    c.style.display = "none";
    const m = document.createElement("pet-shadow");
    return n.appendChild(l), n.appendChild(h), t.appendChild(n), t.appendChild(i), t.appendChild(m), e.appendChild(t), e.appendChild(c), e;
  }
  bindDynamicEffects() {
    const e = this.role.querySelector("pet-ears"), t = this.role.querySelector("pet-eyes"), n = this.role.querySelector("pet-mouth"), i = this.dialogElement, a = (s) => {
      const l = s instanceof MouseEvent ? s.clientX : s.touches[0].clientX, d = s instanceof MouseEvent ? s.clientY : s.touches[0].clientY, o = t.getBoundingClientRect(), h = -(o.left - l), c = -(o.top - d);
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
    const e = (o) => {
      o.button === 0 && (this.startDrag(o.clientX, o.clientY), o.preventDefault());
    }, t = (o) => {
      this.dragging && (this.onDrag(o.clientX, o.clientY), o.preventDefault());
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
    const a = (o) => {
      if (i !== null) return;
      const h = o.changedTouches[0];
      i = h.identifier, this.startDrag(h.clientX, h.clientY);
    }, s = (o) => {
      if (!(!this.dragging || i === null)) {
        for (const h of Array.from(o.changedTouches))
          if (h.identifier === i) {
            this.onDrag(h.clientX, h.clientY);
            break;
          }
      }
    }, l = (o) => {
      if (i !== null) {
        for (const h of Array.from(o.changedTouches))
          if (h.identifier === i) {
            i = null, this.dragging && this.endDrag();
            break;
          }
      }
    };
    this.bodyElement.addEventListener("touchstart", a, {
      passive: !0
    }), document.addEventListener("touchmove", s, { passive: !0 }), document.addEventListener("touchend", l, { passive: !0 }), document.addEventListener("touchcancel", l, { passive: !0 }), this.eventListeners.push(
      {
        element: this.bodyElement,
        event: "touchstart",
        handler: a
      },
      {
        element: document,
        event: "touchmove",
        handler: s
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
      const a = e - this.startPointerX, s = t - this.startPointerY;
      a * a + s * s > 9 && (this.dragMoved = !0);
    }
    const n = e + this.dragDeltaX, i = t + this.dragDeltaY;
    this.updatePosition(n, i, !1);
  }
  endDrag() {
    this.dragging = !1, this.dragMoved && (this.suppressNextClick = !0), this.savePositionByCenter(this.lastCenterX, this.lastCenterY);
  }
  clampCenter(e, t) {
    const n = window.innerWidth, i = window.innerHeight, a = this.bodyElement.getBoundingClientRect(), s = a.width / 2, l = a.height / 2, d = Math.min(Math.max(e, s), n - s), o = Math.min(Math.max(t, l), i - l);
    return { x: d, y: o };
  }
  updatePosition(e, t, n = !1) {
    const { x: i, y: a } = this.clampCenter(e, t), s = this.bodyElement.getBoundingClientRect(), l = Math.round(i - s.width / 2), d = Math.round(a - s.height / 2), o = this.role.style;
    o.left = `${l}px`, o.top = `${d}px`, o.right = "", o.bottom = "", this.lastCenterX = i, this.lastCenterY = a, this.updateDialogSideByCenter(), n && this.savePositionByCenter(i, a);
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
    const n = window.innerWidth, i = window.innerHeight, a = e <= n / 2 ? "left" : "right", s = t <= i / 2 ? "top" : "bottom", l = a === "left" ? e / n : (n - e) / n, d = s === "top" ? t / i : (i - t) / i, o = { h: a, v: s, xRel: l, yRel: d, t: Date.now() };
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(o));
    } catch {
    }
  }
  loadSaved() {
    try {
      const e = localStorage.getItem(this.storageKey);
      if (!e) return null;
      const t = JSON.parse(e);
      if (!t || typeof t != "object") return null;
      const { h: n, v: i, xRel: a, yRel: s } = t;
      return !n || !i || typeof a != "number" || typeof s != "number" ? null : { h: n, v: i, xRel: a, yRel: s };
    } catch {
      return null;
    }
  }
  applySavedPosition() {
    const e = this.loadSaved();
    if (!e) {
      const s = this.bodyElement.getBoundingClientRect();
      this.lastCenterX = s.left + s.width / 2, this.lastCenterY = s.top + s.height / 2;
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
      const a = Date.now(), s = this.dialogElement, l = this.dialogEndTime;
      this.dialogEndTime = a + t, a <= l + 240 && (await y(s, 120), await p(120));
      const d = document.createElement("div");
      if (d.style.fontWeight = "700", d.textContent = this.configs.name + ": ", s.innerHTML = "", s.appendChild(d), n) {
        const o = document.createElement("div");
        o.innerHTML = i, s.appendChild(o);
      } else {
        const o = document.createElement("div");
        o.textContent = i, s.appendChild(o);
      }
      await x(s, 240);
    })), await p(t), this) : this;
  }
  addDialog({
    type: e = "random",
    target: t,
    event: n = "click",
    content: i = "",
    duration: a = 5e3,
    raw: s = !1
  }) {
    if (!i) return this;
    if (e === "random")
      return Array.isArray(i) ? this.dialogList.push(...i) : this.dialogList.push(i), this;
    if (e === "event" && n === "mouseenter" && typeof t == "string") {
      const o = () => {
        this.say({ content: i, duration: a, raw: s });
      };
      return this.hoverDelegates.push({
        selector: t,
        lastTarget: null,
        trigger: () => {
          Date.now() < this.dialogEndTime || o();
        }
      }), this;
    }
    let l = [];
    if (typeof t == "string") {
      const o = document.querySelectorAll(t);
      l = Array.from(o);
    } else t instanceof HTMLElement ? l = [t] : (t instanceof NodeList || Array.isArray(t)) && (l = Array.from(t));
    if (l.length === 0) return this;
    const d = () => {
      Date.now() < this.dialogEndTime || this.say({ content: i, duration: a, raw: s });
    };
    for (const o of l)
      o.addEventListener(n, d), this.eventListeners.push({
        element: o,
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
      content: "那我先溜啦~下次再来陪你！拜拜~",
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
      content: '嗨呀~我是【<b style="display:inline;font-weight:700;font-size:1.2em">IPE酱</b>】！一只会说话的……咳咳，我是说，一个超级智能的 AI 助手！（虽然实际上就是蹲在角落里卖萌）总之，希望能陪你一起编辑 Wiki，加油鸭~',
      duration: 8e3,
      raw: !0
    }).then(() => {
      Date.now() >= e.dialogEndTime && e.say({
        content: "（对了）双击我说的话可以让对话框消失哦~"
      });
    });
    for (const t of E)
      e.addDialog({ type: "random", content: t });
    e.addDialog({
      type: "event",
      target: '#ipe-toolbox__quick-edit, a[href*="action=edit"]',
      event: "mouseenter",
      content: [
        '要编辑页面吗？emmm……其实我帮不上什么忙，但我可以在旁边默默给你打气！<b style="display:inline;font-weight:700;font-size:1.2em">加油加油~</b>',
        "编辑按钮诶！虽然我不会编辑，但我会给你精神支持！",
        "准备大展身手了吗？我就在这里看着你哦~",
        "要改页面啦？我……我就在角落里默默支持你！"
      ],
      duration: 5e3,
      raw: !0
    }), e.addDialog({
      type: "event",
      target: '#ipe-toolbox__quick-delete, a[href*="action=delete"]',
      event: "mouseenter",
      content: [
        "咦？删除按钮诶……要三思而后行哦！（虽然我也不知道该怎么三思）",
        "删除？！这个操作好像很危险的样子……",
        "等等！你确定要删吗？我有点紧张……",
        "这是删除按钮吗？要小心哦！删了就找不回来了！大概！"
      ]
    }), e.addDialog({
      type: "event",
      target: "#ipe-toolbox__preferences",
      event: "mouseenter",
      content: [
        "这个是设置按钮！但不管你怎么设置，我都会在这里陪你的~",
        "设置？会不会把我也设置没了……应该不会吧？",
        "看起来是个很重要的按钮呢！",
        "调整设置可以让编辑更方便哦！我猜的~"
      ]
    }), e.addDialog({
      type: "event",
      target: "a.image",
      event: "mouseenter",
      content: [
        "哇！图片诶！看起来好厉害的样子！",
        "这张图片好好看！是你上传的吗？",
        "图图！让我也康康！",
        "诶嘿，发现了一张有趣的图片~"
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
