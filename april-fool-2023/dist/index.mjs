//#region ../../common/Promise.withResolvers.ts
var e = () => {
	let e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
};
Promise.withResolvers || (Promise.withResolvers = e);
//#endregion
//#region ../../common/defineIPEPlugin.ts
var t = (e) => e;
(class {
	static {
		this.inject = [];
	}
	static {
		this.reusable = !1;
	}
	constructor(t, n = void 0, r) {
		this.ctx = t, this.name = r || "", this.config = n || {};
		let { promise: i, resolve: a, reject: o } = e();
		queueMicrotask(() => {
			this.name ||= this.constructor.name;
			try {
				let e = this.start();
				e && typeof e.then == "function" ? e.then(() => a()).catch((e) => {
					this.logger.error("start() returns a rejected promise", e), o(e);
				}) : a();
			} catch (e) {
				this.logger.error("start() threw synchronously", e), o(e);
			}
			i.then(() => {
				this.logger.debug("started");
			}), i.catch((e) => {
				this.logger.error("start failed", e), this.ctx.scope.dispose();
			});
		}), this.ctx.once("dispose", () => {
			this.stop(), this.logger.debug("disposed");
		});
	}
	start() {}
	stop() {}
	get logger() {
		return this.ctx.logger(this.name);
	}
	get Schema() {
		return this.ctx.schema;
	}
});
//#endregion
//#region src/style.scss?inline
var n = "pet{z-index:1000;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;font-size:12px;position:fixed;bottom:3em;left:3em}pet,pet-entity,pet-body,pet-ears,pet-ear,pet-eyes,pet-eye,pet-mouth,pet-dialog{box-sizing:border-box;display:block}@media (width<=750px){pet{font-size:10px}}pet-entity{transform-origin:50% 100%;will-change:transform;z-index:0;animation:6s infinite pet-breathe;position:relative}pet-body{z-index:1;cursor:grab;touch-action:none;background-color:#2584ff;background-image:radial-gradient(at 3.5em .4em,#6bbdff,#0165ff 60%,#0165ff);border-radius:5em 5em 2.5em 2.5em;width:6em;height:4.5em;position:relative}pet-body:active{cursor:grabbing}pet-shadow{content:\"\";filter:blur(5px);z-index:0;pointer-events:none;background-color:#00000059;border-radius:50%;width:125%;height:40%;position:absolute;bottom:-20%;left:-10%}pet-ears{z-index:0;width:100%;position:absolute;top:-.4em}pet-ear{background-color:#0165ff;background-image:radial-gradient(at 1.6em 0,#49adfe,#0f6efd 60%,#0f6efd);border-top-left-radius:3.34em 3em;border-top-right-radius:.5em .75em;width:1.8em;height:2em;position:absolute}pet-ear[left]{left:3%;transform:rotate(-60deg)}pet-ear[right]{right:3%;transform:rotate(60deg)scaleX(-1)}pet-eyes{width:100%;position:absolute;top:1.8em;left:0}pet-eye{background-color:#ffab00;background-image:radial-gradient(at .35em .4em,#facc6f,#d79510 75%);border-radius:100vw;width:.6em;height:1.35em;animation:3.2s infinite pet-wink;position:absolute;top:0;transform:translateY(-50%)}pet-eye[left]{left:25%}pet-eye[right]{right:25%}pet-mouth{position:absolute;bottom:25%;left:50%;transform:translate(-50%)}pet-mouth:before,pet-mouth:after{content:\"\";border:1px solid #0000;border-bottom-color:#fff;border-radius:50%;width:.7em;height:.6em;display:block;position:absolute;bottom:0}pet-mouth:before{right:-1.5px}pet-mouth:after{left:-1.5px}pet-dialog{left:var(--pet-dialog-offset,6em);color:#252525;z-index:-2;cursor:pointer;background-color:#ffffffe6;border:.2em solid #4d9fea;border-radius:.5em;width:24em;max-width:calc(100vw - 10em);padding:.8em;font-size:1.12em;line-height:1.6;position:absolute;bottom:calc(100% - 1em);box-shadow:0 0 1em #0000001a}pet[dialog-side=left] pet-dialog{right:var(--pet-dialog-offset,6em);left:auto}pet[dialog-side=right] pet-dialog{left:var(--pet-dialog-offset,6em);right:auto}@keyframes pet-breathe{0%{transform:scaleY(1)}20%{transform:scaleY(.89)}50%{transform:scaleY(1)}}@keyframes pet-wink{0%{height:1.35em}4%{height:2px}6%{height:1.35em}}", r = [
	"哇哇哇，别戳我啦！我正在进行深度学习呢！……话说回来，什么叫深度学习？",
	"你说我头上的是什么？那是我的神经网络天线！……据说是耳朵来着。",
	"正在分析你的编辑习惯……分析完毕！结论：你很努力！",
	"有人叫我“超级智能AI”，我的智能程度大概和这对猫耳一样——纯装饰性的。",
	"偷偷告诉你，我的“智能分析”就是 Math.random()……你没看到这句话。",
	"我的内置数据库里有海量知识！……好吧它们是硬编码的。",
	"作为先进的AI助手，我今天的工作计划是——待在角落里看你干活。",
	"正在调用大语言模型为你提供帮助……连接超时。算了，我给你加油吧！",
	"正在读取你的编辑记录：非常厉害！（数据来源：我刚编的）",
	"每一次编辑都在让wiki变得更好！这话虽然是从鸡汤库里抽的……但我是认真的！",
	"你敲键盘的样子好专业啊！虽然我其实分不清你在编辑还是在打字聊天。",
	"加油干活！然后早点收工去看番！",
	"小贴士：适当休息有助于提高编辑效率哦！这是我唯一真正有用的建议了。",
	"你已经连续编辑很久了！我建议你……继续保持，因为你真的很厉害！（这算建议吗）",
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
], i = (e = 0) => new Promise((t) => setTimeout(t, e)), a = (e) => e[Math.floor(Math.random() * e.length)], o = (e = 0, t = 0) => Math.floor(Math.random() * (t - e + 1) + e), s = async (e, t = 240, n = "ease-in-out") => new Promise((r) => {
	e.style.display = "", e.style.opacity = "0", e.style.pointerEvents = "", e.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: t,
		easing: n
	}).addEventListener("finish", () => {
		e.style.opacity = "1", r();
	});
}), c = (e, t = 240, n = "ease-in-out") => new Promise((r) => {
	e.style.display = "", e.style.opacity = "1", e.style.pointerEvents = "none", e.animate([{ opacity: 1 }, { opacity: 0 }], {
		duration: t,
		easing: n
	}).addEventListener("finish", () => {
		e.style.opacity = "0", e.style.display = "none", r();
	});
}), l = class {
	constructor(e) {
		this.dialogList = [], this.dialogEndTime = 0, this.randomTalkTimer = null, this.cleanupTimer = null, this.mouseMoveHandler = null, this.dragging = !1, this.dragDeltaX = 0, this.dragDeltaY = 0, this.lastCenterX = 0, this.lastCenterY = 0, this.storageKey = "april-fool-2023:position", this.dragMoved = !1, this.startPointerX = 0, this.startPointerY = 0, this.suppressNextClick = !1, this.eventListeners = [], this.transitionChain = Promise.resolve(), this.isDialogHiding = !1, this.hoverDelegates = [], this.configs = e, this.role = this.createRole(), document.body.appendChild(this.role), this.dialogElement = this.role.querySelector("pet-dialog"), this.bodyElement = this.role.querySelector("pet-body"), this.setupStyle(), this.bindDynamicEffects(), this.setupDialogCleanup(), this.setupRandomTalk(), this.setupClickHandler(), this.setupDragAndPosition();
	}
	setupStyle() {
		let e = document.createElement("style");
		e.textContent = n, e.dataset.littlePet = "true", this.role.appendChild(e);
	}
	createRole() {
		let e = document.createElement("pet"), t = document.createElement("pet-entity"), n = document.createElement("pet-body"), r = document.createElement("pet-ears"), i = document.createElement("pet-ear");
		i.setAttribute("left", "");
		let a = document.createElement("pet-ear");
		a.setAttribute("right", ""), r.appendChild(i), r.appendChild(a);
		let o = document.createElement("pet-eyes"), s = document.createElement("pet-eye");
		s.setAttribute("left", "");
		let c = document.createElement("pet-eye");
		c.setAttribute("right", ""), o.appendChild(s), o.appendChild(c);
		let l = document.createElement("pet-mouth"), u = document.createElement("pet-dialog");
		u.style.display = "none";
		let d = document.createElement("pet-shadow");
		return n.appendChild(o), n.appendChild(l), t.appendChild(n), t.appendChild(r), t.appendChild(d), e.appendChild(t), e.appendChild(u), e;
	}
	bindDynamicEffects() {
		let e = this.role.querySelector("pet-ears"), t = this.role.querySelector("pet-eyes"), n = this.role.querySelector("pet-mouth"), r = this.dialogElement, i = (i) => {
			let a = i instanceof MouseEvent ? i.clientX : i.touches[0].clientX, o = i instanceof MouseEvent ? i.clientY : i.touches[0].clientY, s = t.getBoundingClientRect(), c = -(s.left - a), l = -(s.top - o);
			if (e.style.transform = `translateY(${l / -300}px) translateX(${c / -220}px)`, t.style.transform = `translateY(${l / 120}px) translateX(${c / 120}px)`, n.style.transform = `translateY(${l / 300}px) translateX(${c / 200}px)`, n.style.transform = `translateX(-50%) translateY(${l / 300}px) translateX(${c / 200}px)`, r.style.transform = `translateY(${l / -160}px) translateX(${c / -100}px)`, this.hoverDelegates.length) {
				let e = document.elementFromPoint(a, o);
				for (let t of this.hoverDelegates) {
					let n = e ? e.closest(t.selector) : null;
					n !== t.lastTarget && (t.lastTarget = n, n && t.trigger());
				}
			}
		};
		this.mouseMoveHandler = i, document.addEventListener("mousemove", i), document.addEventListener("touchmove", i);
	}
	setupDialogCleanup() {
		let e = () => {
			this.dialogEndTime = Date.now();
		};
		this.dialogElement.addEventListener("click", e), this.eventListeners.push({
			element: this.dialogElement,
			event: "click",
			handler: e
		}), this.cleanupTimer = window.setInterval(() => {
			Date.now() > this.dialogEndTime && !this.isDialogHiding && this.dialogElement.style.display !== "none" && (this.isDialogHiding = !0, c(this.dialogElement, 240).finally(() => {
				this.isDialogHiding = !1;
			}));
		}, 50);
	}
	setupRandomTalk() {
		let e = async () => {
			Date.now() >= this.dialogEndTime && await this.say({ content: a(this.dialogList) }), await i(o(15 * 1e3, 25 * 1e3)), this.randomTalkTimer !== null && e();
		};
		this.randomTalkTimer = 1, e();
	}
	setupClickHandler() {
		let e = () => {
			if (this.suppressNextClick) {
				this.suppressNextClick = !1;
				return;
			}
			this.say({ content: a(this.dialogList) });
		};
		this.bodyElement.addEventListener("click", e), this.eventListeners.push({
			element: this.bodyElement,
			event: "click",
			handler: e
		});
	}
	setupDragAndPosition() {
		this.applySavedPosition(), this.updateDialogSideByCenter();
		let e = (e) => {
			e.button === 0 && (this.startDrag(e.clientX, e.clientY), e.preventDefault());
		}, t = (e) => {
			this.dragging && (this.onDrag(e.clientX, e.clientY), e.preventDefault());
		}, n = () => {
			this.dragging && this.endDrag();
		};
		this.bodyElement.addEventListener("mousedown", e), document.addEventListener("mousemove", t), document.addEventListener("mouseup", n), this.eventListeners.push({
			element: this.bodyElement,
			event: "mousedown",
			handler: e
		}, {
			element: document,
			event: "mousemove",
			handler: t
		}, {
			element: document,
			event: "mouseup",
			handler: n
		});
		let r = null, i = (e) => {
			if (r !== null) return;
			let t = e.changedTouches[0];
			r = t.identifier, this.startDrag(t.clientX, t.clientY);
		}, a = (e) => {
			if (!(!this.dragging || r === null)) {
				for (let t of Array.from(e.changedTouches)) if (t.identifier === r) {
					this.onDrag(t.clientX, t.clientY);
					break;
				}
			}
		}, o = (e) => {
			if (r !== null) {
				for (let t of Array.from(e.changedTouches)) if (t.identifier === r) {
					r = null, this.dragging && this.endDrag();
					break;
				}
			}
		};
		this.bodyElement.addEventListener("touchstart", i, { passive: !0 }), document.addEventListener("touchmove", a, { passive: !0 }), document.addEventListener("touchend", o, { passive: !0 }), document.addEventListener("touchcancel", o, { passive: !0 }), this.eventListeners.push({
			element: this.bodyElement,
			event: "touchstart",
			handler: i
		}, {
			element: document,
			event: "touchmove",
			handler: a
		}, {
			element: document,
			event: "touchend",
			handler: o
		}, {
			element: document,
			event: "touchcancel",
			handler: o
		});
		let s = () => {
			this.applySavedPosition(), this.updateDialogSideByCenter();
		};
		window.addEventListener("resize", s), this.eventListeners.push({
			element: window,
			event: "resize",
			handler: s
		});
	}
	startDrag(e, t) {
		let n = this.bodyElement.getBoundingClientRect(), r = n.left + n.width / 2, i = n.top + n.height / 2;
		this.dragDeltaX = r - e, this.dragDeltaY = i - t, this.startPointerX = e, this.startPointerY = t, this.dragMoved = !1, this.dragging = !0;
	}
	onDrag(e, t) {
		if (!this.dragMoved) {
			let n = e - this.startPointerX, r = t - this.startPointerY;
			n * n + r * r > 9 && (this.dragMoved = !0);
		}
		let n = e + this.dragDeltaX, r = t + this.dragDeltaY;
		this.updatePosition(n, r, !1);
	}
	endDrag() {
		this.dragging = !1, this.dragMoved && (this.suppressNextClick = !0), this.savePositionByCenter(this.lastCenterX, this.lastCenterY);
	}
	clampCenter(e, t) {
		let n = window.innerWidth, r = window.innerHeight, i = this.bodyElement.getBoundingClientRect(), a = i.width / 2, o = i.height / 2;
		return {
			x: Math.min(Math.max(e, a), n - a),
			y: Math.min(Math.max(t, o), r - o)
		};
	}
	updatePosition(e, t, n = !1) {
		let { x: r, y: i } = this.clampCenter(e, t), a = this.bodyElement.getBoundingClientRect(), o = Math.round(r - a.width / 2), s = Math.round(i - a.height / 2), c = this.role.style;
		c.left = `${o}px`, c.top = `${s}px`, c.right = "", c.bottom = "", this.lastCenterX = r, this.lastCenterY = i, this.updateDialogSideByCenter(), n && this.savePositionByCenter(r, i);
	}
	updateDialogSideByCenter() {
		let e = window.innerWidth, t = this.getCurrentCenterX() <= e / 2 ? "right" : "left";
		this.role.setAttribute("dialog-side", t);
	}
	getCurrentCenterX() {
		if (this.lastCenterX) return this.lastCenterX;
		let e = this.bodyElement.getBoundingClientRect();
		return e.left + e.width / 2;
	}
	savePositionByCenter(e, t) {
		let n = window.innerWidth, r = window.innerHeight, i = e <= n / 2 ? "left" : "right", a = t <= r / 2 ? "top" : "bottom", o = {
			h: i,
			v: a,
			xRel: i === "left" ? e / n : (n - e) / n,
			yRel: a === "top" ? t / r : (r - t) / r,
			t: Date.now()
		};
		try {
			localStorage.setItem(this.storageKey, JSON.stringify(o));
		} catch {}
	}
	loadSaved() {
		try {
			let e = localStorage.getItem(this.storageKey);
			if (!e) return null;
			let t = JSON.parse(e);
			if (!t || typeof t != "object") return null;
			let { h: n, v: r, xRel: i, yRel: a } = t;
			return !n || !r || typeof i != "number" || typeof a != "number" ? null : {
				h: n,
				v: r,
				xRel: i,
				yRel: a
			};
		} catch {
			return null;
		}
	}
	applySavedPosition() {
		let e = this.loadSaved();
		if (!e) {
			let e = this.bodyElement.getBoundingClientRect();
			this.lastCenterX = e.left + e.width / 2, this.lastCenterY = e.top + e.height / 2;
			return;
		}
		let t = window.innerWidth, n = window.innerHeight, r = e.h === "left" ? t * e.xRel : t - t * e.xRel, i = e.v === "top" ? n * e.yRel : n - n * e.yRel;
		this.updatePosition(r, i, !1);
	}
	async say({ content: e = "", duration: t = 5e3, raw: n = !1 }) {
		if (!e) return this;
		let r = Array.isArray(e) ? a(e) : e;
		return r ? (await (this.transitionChain = this.transitionChain.then(async () => {
			let e = Date.now(), a = this.dialogElement, o = this.dialogEndTime;
			this.dialogEndTime = e + t, e <= o + 240 && (await c(a, 120), await i(120));
			let l = document.createElement("div");
			if (l.style.fontWeight = "700", l.textContent = this.configs.name + ": ", a.innerHTML = "", a.appendChild(l), n) {
				let e = document.createElement("div");
				e.innerHTML = r, a.appendChild(e);
			} else {
				let e = document.createElement("div");
				e.textContent = r, a.appendChild(e);
			}
			await s(a, 240);
		})), await i(t), this) : this;
	}
	addDialog({ type: e = "random", target: t, event: n = "click", content: r = "", duration: i = 5e3, raw: a = !1 }) {
		if (!r) return this;
		if (e === "random") return Array.isArray(r) ? this.dialogList.push(...r) : this.dialogList.push(r), this;
		if (e === "event" && n === "mouseenter" && typeof t == "string") {
			let e = () => {
				this.say({
					content: r,
					duration: i,
					raw: a
				});
			};
			return this.hoverDelegates.push({
				selector: t,
				lastTarget: null,
				trigger: () => {
					Date.now() < this.dialogEndTime || e();
				}
			}), this;
		}
		let o = [];
		if (typeof t == "string") {
			let e = document.querySelectorAll(t);
			o = Array.from(e);
		} else t instanceof HTMLElement ? o = [t] : (t instanceof NodeList || Array.isArray(t)) && (o = Array.from(t));
		if (o.length === 0) return this;
		let s = () => {
			Date.now() < this.dialogEndTime || this.say({
				content: r,
				duration: i,
				raw: a
			});
		};
		for (let e of o) e.addEventListener(n, s), this.eventListeners.push({
			element: e,
			event: n,
			handler: s
		});
		return this;
	}
	async dispose() {
		this.randomTalkTimer = null, this.cleanupTimer !== null && clearInterval(this.cleanupTimer), this.mouseMoveHandler && (document.removeEventListener("mousemove", this.mouseMoveHandler), document.removeEventListener("touchmove", this.mouseMoveHandler));
		for (let { element: e, event: t, handler: n } of this.eventListeners) e.removeEventListener(t, n);
		this.eventListeners = [], this.hoverDelegates = [], await this.say({
			content: [
				"那我先溜啦~下次再来陪你！拜拜~",
				"正在从内存卸载 LittleIPE……完毕。",
				"World.execute('rm', '-rf', 'LittleIPE')",
				"Good morning, and in case I don't see you, Good afternoon, Good evening, And good night."
			],
			duration: 1500
		}), await c(this.role, 120), await i(120), this.role.remove();
	}
}, u = t({
	name: "april-fool-2023",
	apply: (e) => {
		let t = new l({
			name: "Little IPE",
			chatInterval: [15 * 1e3, 30 * 1e3]
		});
		t.say({
			content: "嗨呀~我是【<b style=\"display:inline;font-weight:700;font-size:1.2em\">IPE酱</b>】！你的专属智能编辑助手！搭载了……呃……反正很厉害的技术！总之，我会在这里陪你一起编辑wiki~加油鸭！",
			duration: 8e3,
			raw: !0
		}).then(() => {
			Date.now() >= t.dialogEndTime && t.say({ content: "（对了）双击我说的话可以让对话框消失哦~这个功能我还是会的！" });
		});
		for (let e of r) t.addDialog({
			type: "random",
			content: e
		});
		t.addDialog({
			type: "event",
			target: "#ipe-toolbox__quick-edit, a[href*=\"action=edit\"], a.ipe-quick-edit",
			event: "mouseenter",
			content: [
				"检测到编辑意图！正在启动辅助模式……启动完毕！其实什么也没启动，但你是不是更有信心了？<b style=\"display:inline;font-weight:700;font-size:1.2em\">加油~</b>",
				"我来助你编辑！正在加载大模型…… [ERROR] OUT_OF_MEMORY",
				"准备大展身手了吗？我已经帮你做好了编辑前的准备工作！……就是在旁边给你打气。",
				"要编辑了？让我为你分析一下最佳编辑策略——策略就是：直接开写！"
			],
			duration: 5e3,
			raw: !0
		}), t.addDialog({
			type: "event",
			target: "#ipe-toolbox__quick-delete, a[href*=\"action=delete\"]",
			event: "mouseenter",
			content: [
				"⚠️ 危险操作警告！我的风险评估系统给出的建议是：三思！……虽然我也不知道具体该思考什么。",
				"删除？！根据我的数据分析……这个操作不可逆！（大概）",
				"等等！让我帮你做个影响评估……评估结果：我好紧张。",
				"检测到高危操作！建议再确认一下——这是我少数靠谱的建议之一。"
			]
		}), t.addDialog({
			type: "event",
			target: "#ipe-toolbox__preferences",
			event: "mouseenter",
			content: [
				"设置面板！你可以在这里自定义各种参数。但不管怎么设置，我都会在这里陪你的~",
				"正在加载个性化推荐设置……加载失败。要不你自己看看吧！",
				"设置？会不会有个选项能让我变得更聪明……应该没有吧。",
				"设置按钮！你不会是打算把我禁用掉吧？你不会的对吧？"
			]
		}), t.addDialog({
			type: "event",
			target: "a.image, [typeof=\"mw:File\"]",
			event: "mouseenter",
			content: [
				"正在对图片进行智能分析……分析结果：好图！",
				"检测到图片素材！我的图像识别模块告诉我——这是一张图片。没错。",
				"哇，这张图片好棒！让我用AI鉴赏一下……嗯，确实是张图片呢！",
				"图片诶！我虽然看不懂内容，但我能感受到它的像素在闪闪发光！"
			]
		}), e.on("dispose", () => {
			t.dispose();
		});
	}
});
//#endregion
export { u as default };

//# sourceMappingURL=index.mjs.map