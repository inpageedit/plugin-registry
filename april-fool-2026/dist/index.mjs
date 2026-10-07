//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, a) => (a = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n)), l = () => {
	let e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
};
Promise.withResolvers || (Promise.withResolvers = l);
//#endregion
//#region ../../common/defineIPEPlugin.ts
var u = (e) => e;
(class {
	static {
		this.inject = [];
	}
	static {
		this.reusable = !1;
	}
	constructor(e, t = void 0, n) {
		this.ctx = e, this.name = n || "", this.config = t || {};
		let { promise: r, resolve: i, reject: a } = l();
		queueMicrotask(() => {
			this.name ||= this.constructor.name;
			try {
				let e = this.start();
				e && typeof e.then == "function" ? e.then(() => i()).catch((e) => {
					this.logger.error("start() returns a rejected promise", e), a(e);
				}) : i();
			} catch (e) {
				this.logger.error("start() threw synchronously", e), a(e);
			}
			r.then(() => {
				this.logger.debug("started");
			}), r.catch((e) => {
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
//#region src/terminal/Registry.ts
var d = class {
	constructor() {
		this.commands = /* @__PURE__ */ new Map();
	}
	register(e) {
		this.commands.set(e.name, e);
	}
	get(e) {
		return this.commands.get(e);
	}
	getAll() {
		return Array.from(this.commands.values());
	}
	has(e) {
		return this.commands.has(e);
	}
	formatHelpList(e = !1) {
		let t = this.getAll().filter((t) => e || !t.name.startsWith("."));
		if (!t.length) return "";
		let n = Math.max(...t.map((e) => e.name.length));
		return t.map((e) => `  ${e.name.padEnd(n + 2)}${e.description}`).join("\n");
	}
	formatCommandHelp(e) {
		let t = this.commands.get(e);
		if (!t) return null;
		let n = `${t.name} — ${t.description}\n\n`;
		if (n += `用法: ${t.usage}\n`, t.options && t.options.length > 0) {
			n += "\n选项:\n";
			let e = Math.max(...t.options.map((e) => (e.alias ? `-${e.alias}, --${e.name}` : `    --${e.name}`).length));
			for (let r of t.options) {
				let t = r.alias ? `-${r.alias}, --${r.name}` : `    --${r.name}`;
				n += `  ${t.padEnd(e + 2)}${r.description}\n`;
			}
		}
		return n;
	}
}, f = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	function n(e, t) {
		var n = e;
		return t.slice(0, -1).forEach(function(e) {
			n = n[e] || {};
		}), t[t.length - 1] in n;
	}
	function r(e) {
		return typeof e == "number" || /^0x[0-9a-f]+$/i.test(e) ? !0 : /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(e);
	}
	function i(e, t) {
		return t === "constructor" && typeof e[t] == "function" || t === "__proto__";
	}
	t.exports = function(e, t) {
		t ||= {};
		var a = {
			bools: {},
			strings: {},
			unknownFn: null
		};
		typeof t.unknown == "function" && (a.unknownFn = t.unknown), typeof t.boolean == "boolean" && t.boolean ? a.allBools = !0 : [].concat(t.boolean).filter(Boolean).forEach(function(e) {
			a.bools[e] = !0;
		});
		var o = {};
		function s(e) {
			return o[e].some(function(e) {
				return a.bools[e];
			});
		}
		Object.keys(t.alias || {}).forEach(function(e) {
			o[e] = [].concat(t.alias[e]), o[e].forEach(function(t) {
				o[t] = [e].concat(o[e].filter(function(e) {
					return t !== e;
				}));
			});
		}), [].concat(t.string).filter(Boolean).forEach(function(e) {
			a.strings[e] = !0, o[e] && [].concat(o[e]).forEach(function(e) {
				a.strings[e] = !0;
			});
		});
		var c = t.default || {}, l = { _: [] };
		function u(e, t) {
			return a.allBools && /^--[^=]+$/.test(t) || a.strings[e] || a.bools[e] || o[e];
		}
		function d(e, t, n) {
			for (var r = e, o = 0; o < t.length - 1; o++) {
				var s = t[o];
				if (i(r, s)) return;
				r[s] === void 0 && (r[s] = {}), (r[s] === Object.prototype || r[s] === Number.prototype || r[s] === String.prototype) && (r[s] = {}), r[s] === Array.prototype && (r[s] = []), r = r[s];
			}
			var c = t[t.length - 1];
			i(r, c) || ((r === Object.prototype || r === Number.prototype || r === String.prototype) && (r = {}), r === Array.prototype && (r = []), r[c] === void 0 || a.bools[c] || typeof r[c] == "boolean" ? r[c] = n : Array.isArray(r[c]) ? r[c].push(n) : r[c] = [r[c], n]);
		}
		function f(e, t, n) {
			if (!(n && a.unknownFn && !u(e, n) && a.unknownFn(n) === !1)) {
				var i = !a.strings[e] && r(t) ? Number(t) : t;
				d(l, e.split("."), i), (o[e] || []).forEach(function(e) {
					d(l, e.split("."), i);
				});
			}
		}
		Object.keys(a.bools).forEach(function(e) {
			f(e, c[e] === void 0 ? !1 : c[e]);
		});
		var p = [];
		e.indexOf("--") !== -1 && (p = e.slice(e.indexOf("--") + 1), e = e.slice(0, e.indexOf("--")));
		for (var m = 0; m < e.length; m++) {
			var h = e[m], g, _;
			if (/^--.+=/.test(h)) {
				var v = h.match(/^--([^=]+)=([\s\S]*)$/);
				g = v[1];
				var y = v[2];
				a.bools[g] && (y = y !== "false"), f(g, y, h);
			} else if (/^--no-.+/.test(h)) g = h.match(/^--no-(.+)/)[1], f(g, !1, h);
			else if (/^--.+/.test(h)) g = h.match(/^--(.+)/)[1], _ = e[m + 1], _ !== void 0 && !/^(-|--)[^-]/.test(_) && !a.bools[g] && !a.allBools && (!o[g] || !s(g)) ? (f(g, _, h), m += 1) : /^(true|false)$/.test(_) ? (f(g, _ === "true", h), m += 1) : f(g, a.strings[g] ? "" : !0, h);
			else if (/^-[^-]+/.test(h)) {
				for (var b = h.slice(1, -1).split(""), x = !1, S = 0; S < b.length; S++) {
					if (_ = h.slice(S + 2), _ === "-") {
						f(b[S], _, h);
						continue;
					}
					if (/[A-Za-z]/.test(b[S]) && _[0] === "=") {
						f(b[S], _.slice(1), h), x = !0;
						break;
					}
					if (/[A-Za-z]/.test(b[S]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(_)) {
						f(b[S], _, h), x = !0;
						break;
					}
					if (b[S + 1] && b[S + 1].match(/\W/)) {
						f(b[S], h.slice(S + 2), h), x = !0;
						break;
					} else f(b[S], a.strings[b[S]] ? "" : !0, h);
				}
				g = h.slice(-1)[0], !x && g !== "-" && (e[m + 1] && !/^(-|--)[^-]/.test(e[m + 1]) && !a.bools[g] && (!o[g] || !s(g)) ? (f(g, e[m + 1], h), m += 1) : e[m + 1] && /^(true|false)$/.test(e[m + 1]) ? (f(g, e[m + 1] === "true", h), m += 1) : f(g, a.strings[g] ? "" : !0, h));
			} else if ((!a.unknownFn || a.unknownFn(h) !== !1) && l._.push(a.strings._ || !r(h) ? h : Number(h)), t.stopEarly) {
				l._.push.apply(l._, e.slice(m + 1));
				break;
			}
		}
		return Object.keys(c).forEach(function(e) {
			n(l, e.split(".")) || (d(l, e.split("."), c[e]), (o[e] || []).forEach(function(t) {
				d(l, t.split("."), c[e]);
			}));
		}), t["--"] ? l["--"] = p.slice() : p.forEach(function(e) {
			l._.push(e);
		}), l;
	};
})))(), 1);
function p(e) {
	let t = [], n = "", r = !1, i = !1, a = !1;
	for (let o of e) {
		if (a) {
			n += o, a = !1;
			continue;
		}
		if (o === "\\") {
			a = !0;
			continue;
		}
		if (o === "'" && !i) {
			r = !r;
			continue;
		}
		if (o === "\"" && !r) {
			i = !i;
			continue;
		}
		if (o === " " && !r && !i) {
			n &&= (t.push(n), "");
			continue;
		}
		n += o;
	}
	return n && t.push(n), (0, f.default)(t);
}
//#endregion
//#region src/terminal/Terminal.ts
var m = /* @__PURE__ */ function(e) {
	return e.Success = "ipe-cli-success", e.Error = "ipe-cli-error", e.Warning = "ipe-cli-warning-text", e.Info = "ipe-cli-info", e.Muted = "ipe-cli-muted", e.Highlight = "ipe-cli-highlight", e;
}({}), h = "ipe-cli-history", g = "ipe-cli-height", _ = "ipe-cli-warning-dismissed", v = 50, y = class {
	constructor(e) {
		this.ctx = e, this.registry = new d(), this.history = [], this.historyIndex = -1, this.currentInput = "", this.heredocMarker = null, this.heredocPrefix = "", this.isVisible = !1, this.loadHistory(), this.createDOM();
	}
	open() {
		this.isVisible = !0, this.drawer.classList.remove("ipe-cli-hidden"), this.inputEl.focus(), this.ctx.emit("tui/open", { ctx: this.ctx });
	}
	close() {
		this.isVisible = !1, this.drawer.classList.add("ipe-cli-hidden"), this.ctx.emit("tui/close", { ctx: this.ctx });
	}
	toggle() {
		this.isVisible ? this.close() : this.open();
	}
	print(e, t) {
		let n = document.createElement("div");
		return t && (n.className = t), n.textContent = e, this.outputEl.appendChild(n), this.outputEl.scrollTop = this.outputEl.scrollHeight, n;
	}
	printHTML(e) {
		let t = document.createElement("div");
		return t.innerHTML = e, this.outputEl.appendChild(t), this.outputEl.scrollTop = this.outputEl.scrollHeight, t;
	}
	printElement(e) {
		let t = document.createElement("div");
		return t.appendChild(e), this.outputEl.appendChild(t), this.outputEl.scrollTop = this.outputEl.scrollHeight, t;
	}
	clear() {
		this.outputEl.innerHTML = "";
	}
	setInputEnabled(e) {
		this.inputEl.disabled = !e, this.inputEl.focus();
	}
	dispose() {
		this.drawer.remove();
	}
	createDOM() {
		this.drawer = document.createElement("div"), this.drawer.className = "ipe-cli-drawer ipe-cli-hidden ipe-cli-no-transition";
		let e = localStorage.getItem(g);
		e && (this.drawer.style.height = e);
		let t = document.createElement("div");
		t.className = "ipe-cli-topbar", t.innerHTML = "\n      <span class=\"ipe-cli-topbar-title\">ipe-cli v2026.04.01</span>\n      <span class=\"ipe-cli-topbar-actions\">\n        <button class=\"ipe-cli-topbar-help\" title=\"What is this?\">?</button>\n        <button class=\"ipe-cli-topbar-close\">×</button>\n      </span>\n    ", t.querySelector(".ipe-cli-topbar-close").addEventListener("click", () => this.close()), t.querySelector(".ipe-cli-topbar-help").addEventListener("click", () => {
			this.print("🎉 哈哈，骗到你啦！InPageEdit 向来有在每年愚人节整活的传统。如果不喜欢，输入 .uninstall 即可卸载哦！感谢你的使用~"), this.print("🎉 Gotcha! InPageEdit has a tradition of April Fools' pranks every year. If you don't like it, type .uninstall to remove it. Thanks for using InPageEdit!");
		}), this.setupResize(t, t.querySelector(".ipe-cli-topbar-actions")), this.warningEl = document.createElement("div"), this.warningEl.className = "ipe-cli-warning", this.warningEl.innerHTML = "\n      <span>⚠ 虽然这看上去很搞笑，但你在这里的操作（编辑、移动、删除等）都是真实的！ / Actions here (edit, move, delete, etc.) are REAL!</span>\n      <button class=\"ipe-cli-warning-close\">×</button>\n    ", this.warningEl.querySelector(".ipe-cli-warning-close").addEventListener("click", () => {
			this.warningEl.style.display = "none", localStorage.setItem(_, "1");
		}), localStorage.getItem(_) === "1" && (this.warningEl.style.display = "none"), this.outputEl = document.createElement("div"), this.outputEl.className = "ipe-cli-output";
		let n = document.createElement("div");
		n.className = "ipe-cli-input-area";
		let r = document.createElement("span");
		r.className = "ipe-cli-prompt", r.textContent = "✏️ ", this.inputEl = document.createElement("textarea"), this.inputEl.className = "ipe-cli-input", this.inputEl.rows = 1, this.inputEl.spellcheck = !1, this.inputEl.autocomplete = "off", this.inputEl.placeholder = "输入命令...", this.setupInput(), n.append(r, this.inputEl), this.drawer.append(t, this.warningEl, this.outputEl, n), document.body.appendChild(this.drawer), requestAnimationFrame(() => {
			this.drawer.classList.remove("ipe-cli-no-transition");
		});
	}
	setupInput() {
		this.inputEl.addEventListener("keydown", (e) => {
			if (!(e.key === "Enter" && e.shiftKey)) {
				if (e.key === "Enter" && !e.shiftKey) {
					if (this.heredocMarker) {
						let t = this.inputEl.value.split("\n");
						t[t.length - 1].trim() === this.heredocMarker && (e.preventDefault(), this.handleHeredocSubmit(t));
						return;
					}
					e.preventDefault(), this.handleSubmit();
					return;
				}
				if (e.key === "ArrowUp" && !this.heredocMarker) {
					e.preventDefault(), this.navigateHistory(-1);
					return;
				}
				if (e.key === "ArrowDown" && !this.heredocMarker) {
					e.preventDefault(), this.navigateHistory(1);
					return;
				}
			}
		}), this.inputEl.addEventListener("input", () => {
			this.inputEl.style.height = "auto", this.inputEl.style.height = this.inputEl.scrollHeight + "px";
		});
	}
	handleHeredocSubmit(e) {
		let t = e.slice(0, -1).join("\n").replace(/\\/g, "\\\\").replace(/"/g, "\\\""), n = this.heredocPrefix + "\"" + t + "\"";
		this.print(`✏️ ${this.inputEl.value}`, "ipe-cli-muted"), this.inputEl.value = "", this.inputEl.style.height = "auto", this.heredocMarker = null, this.heredocPrefix = "", this.inputEl.placeholder = "输入命令...", this.execute(n, !0);
	}
	handleSubmit() {
		let e = this.inputEl.value;
		this.inputEl.value = "", this.inputEl.style.height = "auto";
		let t = e.match(/<<(\w+)\s*$/);
		if (t) {
			this.heredocMarker = t[1], this.heredocPrefix = e.slice(0, t.index) + "", this.print(`✏️ ${e}`, "ipe-cli-muted"), this.inputEl.placeholder = `输入内容，以 ${this.heredocMarker} 结束 / Type content, end with ${this.heredocMarker}`;
			return;
		}
		this.execute(e);
	}
	async execute(e, t = !1) {
		let n = e.trim();
		if (!n) return;
		t || this.print(`✏️ ${n}`, "ipe-cli-muted"), this.pushHistory(n), this.historyIndex = -1, this.currentInput = "";
		let r = p(n), i = r._[0];
		if (!i) return;
		if (r.help && i !== "help") {
			let e = this.registry.formatCommandHelp(i);
			e ? this.print(e) : this.print(`未知命令: ${i}`, "ipe-cli-error");
			return;
		}
		let a = this.registry.get(i);
		if (!a) {
			this.ctx.bail("tui/command-not-found", {
				ctx: this.ctx,
				input: n,
				command: i
			}) || this.print(`未知命令: ${i}。输入 "help" 查看可用命令。`, "ipe-cli-error");
			return;
		}
		if (!this.ctx.bail("tui/before-execute", {
			ctx: this.ctx,
			input: n,
			command: i
		})) {
			this.ctx.emit("analytics/event", {
				feature: "ipe-cli",
				subtype: i
			});
			try {
				this.setInputEnabled(!1), await a.action(this.ctx, r);
			} catch (e) {
				let t = `Error: ${e?.message || e}`;
				this.print(t, "ipe-cli-error"), this.ctx.emit("tui/error", {
					ctx: this.ctx,
					message: t,
					cause: e,
					command: i
				});
			} finally {
				this.setInputEnabled(!0), this.inputEl.focus();
			}
			this.ctx.emit("tui/after-execute", {
				ctx: this.ctx,
				input: n,
				command: i
			});
		}
	}
	navigateHistory(e) {
		this.history.length !== 0 && (this.historyIndex === -1 && (this.currentInput = this.inputEl.value), e === -1 ? this.historyIndex < this.history.length - 1 && this.historyIndex++ : this.historyIndex > -1 && this.historyIndex--, this.historyIndex === -1 ? this.inputEl.value = this.currentInput : this.inputEl.value = this.history[this.historyIndex], this.inputEl.style.height = "auto", this.inputEl.style.height = this.inputEl.scrollHeight + "px");
	}
	pushHistory(e) {
		let t = this.history.indexOf(e);
		t !== -1 && this.history.splice(t, 1), this.history.unshift(e), this.history.length > v && this.history.pop(), this.saveHistory();
	}
	loadHistory() {
		try {
			let e = localStorage.getItem(h);
			e && (this.history = JSON.parse(e));
		} catch {}
	}
	saveHistory() {
		localStorage.setItem(h, JSON.stringify(this.history));
	}
	setupResize(e, t) {
		let n = 0, r = 0, i = (e) => {
			e.preventDefault();
			let t = n - e.clientY, i = Math.min(Math.max(r + t, 120), window.innerHeight * .8);
			this.drawer.style.height = i + "px";
		}, a = (e) => {
			e.preventDefault();
			let t = n - e.touches[0].clientY, i = Math.min(Math.max(r + t, 120), window.innerHeight * .8);
			this.drawer.style.height = i + "px";
		}, o = () => {
			document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", o), document.removeEventListener("touchmove", a), document.removeEventListener("touchend", o), document.body.style.userSelect = "", localStorage.setItem(g, this.drawer.style.height);
		}, s = (e) => {
			n = e, r = this.drawer.offsetHeight, document.body.style.userSelect = "none", document.addEventListener("mousemove", i), document.addEventListener("mouseup", o), document.addEventListener("touchmove", a, { passive: !1 }), document.addEventListener("touchend", o);
		};
		e.addEventListener("mousedown", (e) => {
			t.contains(e.target) || (e.preventDefault(), s(e.clientY));
		}), e.addEventListener("touchstart", (e) => {
			t.contains(e.target) || s(e.touches[0].clientY);
		}, { passive: !0 });
	}
};
//#endregion
//#region src/utils/pick.ts
function b(e) {
	return e[Math.floor(Math.random() * e.length)];
}
//#endregion
//#region src/utils/sleep.ts
function x(e) {
	return new Promise((t) => setTimeout(t, e));
}
//#endregion
//#region src/terminal/boot.ts
var S = [
	"Claude",
	"Gemini",
	"LLaMA",
	"ChatGPT",
	"Bard",
	"Ernie Bot",
	"Qwen",
	"DeepSeek"
], C = [
	"编辑 wiki 是属于人类的艺术。向来如此！\n  Wiki editing is a human art. Always has been!",
	"切换到SOTA模型：你的大脑！百万 token 仅消耗 20 卡路里！\n  Switching to SOTA model: your brain! 1M tokens for just 20 calories!",
	"AI 写不出好条目。但你可以——伟大的编辑者！\n  AI can't write a good article. But you can — great editor!",
	"你不需要 AI 来写一篇好文章。没有 AI 的才华比得上你！\n  You don't need AI to write a good article. No AI talent compares to yours!",
	"神经网络宕机了，但你的神经元无比健壮！\n  Neural network crashed, but your neurons are rock solid!"
];
function w() {
	return [
		{
			text: "> 正在初始化 ipe-cli v1.0.0...",
			delay: 0
		},
		{
			text: "> 加载 MCP 服务器配置...                      ✓",
			className: m.Success,
			delay: 200
		},
		{
			text: "> 正在加载 20,260,401 个 SKILLs...            ✓",
			className: m.Success,
			delay: 300
		},
		{
			text: `> 连接 ${b(S)} API 端点...                     ✓`,
			className: m.Success,
			delay: 700
		},
		{
			text: "> 验证 Agent 凭证...                          ✓",
			className: m.Success,
			delay: 600
		},
		{
			text: "> 下载神经语言模型 (7B)...     [█████░░░░░] 42%",
			className: m.Success,
			delay: 700
		},
		{
			text: "> ERROR: 连接被拒绝                           ✗",
			className: m.Error,
			delay: 1e3
		},
		{
			text: "> ERROR: AI 模块初始化失败                    ✗",
			className: m.Error,
			delay: 500
		},
		{
			text: "",
			delay: 500
		},
		{
			text: `  ${b(C)}`,
			className: m.Highlight,
			delay: 500
		}
	];
}
async function T(e) {
	e.setInputEnabled(!1);
	let t = w();
	for (let n of t) await x(n.delay), e.print(n.text, n.className);
	await x(1500), E(e), e.setInputEnabled(!0);
}
function E(e) {
	e.print("输入 \"help\" 查看所有可用命令。Type \"help\" to see all commands.", m.Muted);
}
//#endregion
//#region src/commands/help.ts
function D(e) {
	return {
		name: "help",
		description: "显示帮助信息",
		usage: "help [command] [--all]",
		options: [{
			name: "all",
			type: "boolean",
			description: "显示包括隐藏命令在内的所有命令"
		}],
		action(t, n) {
			let r = n._[1];
			if (r) {
				let t = e.registry.formatCommandHelp(r);
				t ? e.print(t) : e.print(`未知命令: ${r}`, m.Error);
			} else e.print("可用命令:\n"), e.print(e.registry.formatHelpList(n.all)), n.all || e.print("\n输入 \"help --all\" 查看隐藏命令。", m.Muted), e.print("\n输入 \"help <command>\" 查看详细用法。", m.Muted);
		}
	};
}
//#endregion
//#region src/commands/clear.ts
function O(e) {
	return {
		name: "clear",
		description: "清空终端",
		usage: "clear",
		action() {
			e.clear();
		}
	};
}
//#endregion
//#region src/commands/whoami.ts
function k(e) {
	return {
		name: "whoami",
		description: "显示当前用户信息",
		usage: "whoami",
		async action(t) {
			let n = t.wiki.userInfo;
			e.print(`用户名: ${n.name}`), e.print(`用户ID: ${n.id}`), e.print(`用户组: ${n.groups?.join(", ") || "(无)"}`);
		}
	};
}
//#endregion
//#region src/commands/siteinfo.ts
function A(e) {
	return {
		name: "siteinfo",
		description: "显示站点信息",
		usage: "siteinfo",
		async action(t) {
			let n = t.wiki.general;
			e.print(`站点名: ${n.sitename}`), e.print(`版本:   ${n.generator}`), e.print(`语言:   ${n.lang}`), e.print(`主页:   ${n.base}`);
		}
	};
}
//#endregion
//#region src/commands/pageinfo.ts
function j(e) {
	return {
		name: "pageinfo",
		description: "显示页面信息",
		usage: "pageinfo [pagename]",
		options: [{
			name: "title",
			alias: "t",
			type: "string",
			description: "页面标题"
		}],
		async action(t, n) {
			let r = n._[1] || n.title || t.currentPage.wikiTitle.toText(), i = (await t.wikiPage.newFromTitle(r)).pageInfo;
			if (!i || !i.title) {
				e.print(`页面 ${r} 不存在或无法获取信息。`, m.Error);
				return;
			}
			e.print(`标题:     ${i.title}`), e.print(`页面ID:   ${i.pageid}`), e.print(`命名空间: ${i.ns}`), e.print(`内容模型: ${i.contentmodel}`), e.print(`最后修订: ${i.lastrevid}`), e.print(`最后编辑: ${i.touched}`);
			let a = i.fullurl || i.canonicalurl;
			a && e.printHTML(`链接:     <a href="${encodeURI(a)}" target="_blank">${a.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</a>`);
		}
	};
}
//#endregion
//#region src/commands/fetch.ts
function M(e) {
	return {
		name: "fetch",
		description: "获取页面源码",
		usage: "fetch [pagename]",
		options: [{
			name: "title",
			alias: "t",
			type: "string",
			description: "页面标题"
		}, {
			name: "section",
			alias: "s",
			type: "number",
			description: "段落编号"
		}],
		async action(t, n) {
			let r = n._[1] || n.title || t.currentPage.wikiTitle.toText();
			e.print(`正在获取 ${r} ...`, m.Muted);
			let i = (await t.wikiPage.newFromTitle(r, !1, n.section)).revisions?.[0], a = i?.content ?? i?.["*"];
			if (a == null) {
				e.print(`页面 ${r} 没有内容或不存在。`, m.Error);
				return;
			}
			e.print(a);
		}
	};
}
//#endregion
//#region src/commands/edit.ts
function N(e) {
	return {
		name: "edit",
		description: "编辑页面",
		usage: "edit [pagename] [--ui] [--section N] [--summary \"...\"] [--content \"...\"]",
		options: [
			{
				name: "title",
				alias: "t",
				type: "string",
				description: "页面标题"
			},
			{
				name: "ui",
				type: "boolean",
				description: "打开快速编辑界面"
			},
			{
				name: "section",
				alias: "s",
				type: "number",
				description: "段落编号"
			},
			{
				name: "summary",
				type: "string",
				description: "编辑摘要"
			},
			{
				name: "content",
				alias: "c",
				type: "string",
				description: "页面内容"
			},
			{
				name: "minor",
				alias: "m",
				type: "boolean",
				description: "标记为小编辑"
			}
		],
		async action(t, n) {
			let r = n._[1] || n.title || t.currentPage.wikiTitle.toText();
			if (n.ui) {
				t.quickEdit({
					title: r,
					section: n.section
				}), e.print("已打开编辑界面", m.Muted);
				return;
			}
			let i = n.content;
			if (!i) {
				e.print("终端模式需要提供 --content 参数。", m.Error), e.print("提示: 使用 Shift+Enter 换行，或使用 <<EOF 语法输入多行内容。", m.Muted), e.print("示例: edit 页面名 --content <<EOF", m.Muted);
				return;
			}
			e.print(`正在编辑 ${r} ...`, m.Muted);
			let a = await t.wikiPage.newFromTitle(r), o = (await a.edit({
				text: i,
				summary: n.summary || "via ipe-cli",
				minor: n.minor || !1,
				section: n.section
			})).data?.edit;
			if (o) {
				let t = String(o.title).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), n = a.pageInfo?.fullurl || a.pageInfo?.canonicalurl || "";
				if (n) {
					let r = n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
					e.printHTML(`<span class="${m.Success}">Edit successful: ${t} (revid: ${o.newrevid}) <a href="${encodeURI(n)}" target="_blank">${r}</a></span>`);
				} else e.print(`Edit successful: ${o.title} (revid: ${o.newrevid})`, m.Success);
			}
		}
	};
}
//#endregion
//#region src/commands/move.ts
function P(e) {
	return {
		name: "move",
		description: "移动/重命名页面",
		usage: "move <from> <to> [--reason \"...\"] [--no-redirect] [--ui]",
		options: [
			{
				name: "from",
				type: "string",
				description: "源页面标题"
			},
			{
				name: "to",
				type: "string",
				description: "目标页面标题"
			},
			{
				name: "reason",
				type: "string",
				description: "移动原因"
			},
			{
				name: "no-redirect",
				type: "boolean",
				description: "不留下重定向"
			},
			{
				name: "ui",
				type: "boolean",
				description: "打开快速移动界面"
			}
		],
		async action(t, n) {
			let r = n._[1] || n.from, i = n._[2] || n.to;
			if (n.ui) {
				t.quickMove.showModal({
					from: r,
					to: i
				}), e.print("已打开移动界面", m.Muted);
				return;
			}
			if (!r || !i) {
				e.print("用法: move <from> <to>", m.Error);
				return;
			}
			e.print(`正在移动 ${r} → ${i} ...`, m.Muted), await (await t.wikiPage.newFromTitle(r)).moveTo(i, n.reason, { noredirect: n["no-redirect"] === !0 }), e.print(`Move successful: ${r} → ${i}`, m.Success);
		}
	};
}
//#endregion
//#region src/commands/delete.ts
function F(e) {
	return {
		name: "delete",
		description: "删除页面",
		usage: "delete <pagename> [--reason \"...\"]",
		options: [{
			name: "title",
			alias: "t",
			type: "string",
			description: "页面标题"
		}, {
			name: "reason",
			type: "string",
			description: "删除原因"
		}],
		async action(t, n) {
			let r = n._[1] || n.title;
			if (!r) {
				e.print("用法: delete <pagename>", m.Error);
				return;
			}
			e.print(`正在删除 ${r} ...`, m.Muted), await (await t.wikiPage.newFromTitle(r)).delete(n.reason), e.print(`Delete successful: ${r}`, m.Success);
		}
	};
}
//#endregion
//#region src/commands/redirect.ts
function I(e) {
	return {
		name: "redirect",
		description: "创建重定向",
		usage: "redirect <from> <to> [--ui]",
		options: [
			{
				name: "from",
				type: "string",
				description: "重定向页面"
			},
			{
				name: "to",
				type: "string",
				description: "目标页面"
			},
			{
				name: "ui",
				type: "boolean",
				description: "打开快速重定向界面"
			}
		],
		async action(t, n) {
			let r = n._[1] || n.from, i = n._[2] || n.to;
			if (n.ui) {
				t.quickRedirect.showModal({
					from: r,
					to: i
				}), e.print("已打开重定向界面", m.Muted);
				return;
			}
			if (!r || !i) {
				e.print("用法: redirect <from> <to>", m.Error);
				return;
			}
			e.print(`正在创建重定向 ${r} → ${i} ...`, m.Muted), await t.quickRedirect.redirectPage({
				from: r,
				to: i
			}), e.print(`Redirect successful: ${r} → ${i}`, m.Success);
		}
	};
}
//#endregion
//#region src/commands/preview.ts
function L(e) {
	return {
		name: "preview",
		description: "预览页面渲染结果",
		usage: "preview [pagename] [--ui]",
		options: [{
			name: "title",
			alias: "t",
			type: "string",
			description: "页面标题"
		}, {
			name: "ui",
			type: "boolean",
			description: "打开预览界面"
		}],
		async action(t, n) {
			let r = n._[1] || n.title || t.currentPage.wikiTitle.toText();
			if (n.ui) {
				let n = await t.wikiPage.newFromTitle(r), i = n.revisions?.[0], a = i?.content ?? i?.["*"] ?? "";
				t.quickPreview(a, void 0, n), e.print("已打开预览界面", m.Muted);
				return;
			}
			e.print(`正在预览 ${r} ...`, m.Muted);
			let i = await t.wikiPage.newFromTitle(r), a = i.revisions?.[0], o = a?.content ?? a?.["*"] ?? "", s = await i.preview(o), c = s.data?.parse?.text?.["*"] || s.data?.parse?.text;
			if (c) {
				let t = document.createElement("iframe");
				t.sandbox.add("allow-same-origin"), t.className = "ipe-cli-preview-iframe", document.createElement("div").appendChild(t), e.printHTML(""), e.outputEl.lastElementChild.appendChild(t);
				let n = t.contentDocument;
				n.open(), n.write(`<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:8px;margin:0;}</style></head><body>${c}</body></html>`), n.close();
				let r = () => {
					t.style.height = n.body.scrollHeight + "px";
				};
				t.addEventListener("load", r), r();
			} else e.print("预览失败: 无法获取渲染结果", m.Error);
		}
	};
}
//#endregion
//#region src/commands/diff.ts
function R(e) {
	return {
		name: "diff",
		description: "比较两个修订版本",
		usage: "diff <revid1> <revid2>",
		async action(t, n) {
			let r = Number(n._[1]), i = Number(n._[2]);
			if (!r || !i) {
				e.print("用法: diff <revid1> <revid2>", m.Error);
				return;
			}
			t.quickDiff.comparePages({
				fromrev: r,
				torev: i
			}), e.print("已打开差异界面", m.Muted);
		}
	};
}
//#endregion
//#region src/commands/upload.ts
function z(e) {
	return {
		name: "upload",
		description: "上传文件",
		usage: "upload --ui",
		options: [{
			name: "ui",
			type: "boolean",
			description: "打开上传界面"
		}],
		async action(t, n) {
			if (!n.ui) {
				e.print("终端无法选择本地文件，请使用 upload --ui", m.Error);
				return;
			}
			await t.quickUpload.showModal(), e.print("已打开上传界面", m.Muted);
		}
	};
}
//#endregion
//#region src/commands/preferences.ts
function B(e) {
	return {
		name: "preferences",
		description: "查看或修改设置",
		usage: "preferences list | get <key> | set <key> <value> [--ui]",
		options: [{
			name: "ui",
			type: "boolean",
			description: "打开设置面板"
		}],
		async action(t, n) {
			if (n.ui) {
				t.preferencesUI.showModal(), e.print("已打开设置面板", m.Muted);
				return;
			}
			let r = n._[1];
			if (!r || r === "list") {
				let n = await t.preferences.get(), r = Object.entries(n).sort(([e], [t]) => e.localeCompare(t));
				for (let [t, n] of r) e.print(`${t} = ${JSON.stringify(n)}`);
				return;
			}
			if (r === "get") {
				let r = n._[2];
				if (!r) {
					e.print("用法: preferences get <key>", m.Error);
					return;
				}
				let i = await t.preferences.get(r);
				e.print(`${r} = ${JSON.stringify(i)}`);
				return;
			}
			if (r === "set") {
				let r = n._[2], i = n._[3];
				if (!r || i === void 0) {
					e.print("用法: preferences set <key> <value>", m.Error);
					return;
				}
				let a = i;
				try {
					a = JSON.parse(String(i));
				} catch {}
				await t.preferences.set(r, a), e.print(`${r} = ${JSON.stringify(a)}`, m.Success);
				return;
			}
			e.print(`未知子命令: ${r}。可用: list, get, set`, m.Error);
		}
	};
}
//#endregion
//#region src/commands/sili.ts
function V(e) {
	return e.drawer.classList.contains("sili-mode") ? !1 : (e.drawer.classList.add("sili-mode"), e.drawer.querySelector(".ipe-cli-topbar-title").textContent = "SILI CLI (?", e.inputEl.placeholder = "嘿嘿，我的 SILI 🤤", !0);
}
var H = [
	"诶，我在~",
	"叫我干嘛呀~",
	"Link start~",
	"Aye Aye Captain~",
	"I'm still alive~",
	"SILI在的哦，有什么事吗~",
	"喂，其实你看到我的回复了吧！",
	"你不会是拿SILI开心吧？",
	"我不在。"
], U = "https://r2.epb.wiki/cdn-cgi/image/format=auto,fit=contain,width=100,height=100,onerror=redirect/random/memes/cao/", W = [
	"草",
	"花",
	"叶",
	"星",
	"日",
	"月",
	"水",
	"瓦",
	"海",
	"菜",
	"utf"
], G = (e) => `${U}${W[(W.indexOf(e || "") + 1) % W.length]}.jpg`, K = /* @__PURE__ */ RegExp("(笨蛋|傻瓜|傻子|⑨|智障|白痴|蠢货|baka)", "i"), q = [
	"¿你说谁是$1呢？",
	"别骂了别骂了，我真的不是$1",
	"哼，你才是$1呢",
	"$1？不是，我才不是呢！",
	"诶，$1不会指的是我吧？",
	"你礼貌吗？"
];
function J(e) {
	return {
		name: "sili",
		description: "What the SILI doing?",
		usage: "sili [subcommand]\n" + [
			"草",
			"wiki",
			"笨蛋"
		].map((e) => `  ${e}`).join("\n"),
		async action(t, n) {
			let r = t.logger("cli/sili"), i = V(e), a = n._[1];
			if (r.info({
				argv: n,
				justEntered: i,
				subcommand: a
			}), i && (e.print("┏┓┳┓ ┳\n┗┓┃┃ ┃\n┗┛┻┗┛┻\n~The distributed data transmission network with Spatiotemporal Isomorphic and Limitless Interdimensional~"), e.print("\n", m.Muted), !a)) {
				e.print("奇怪，这是什么地方？这里不是QQ群吧……？\n");
				return;
			}
			if (W.includes(a?.toLowerCase() || "")) {
				let t = G(a?.toLowerCase() || ""), n = document.createElement("img");
				n.src = t, n.alt = a, n.width = 100, n.height = 100, e.printElement(n);
				return;
			} else if (a === "wiki") {
				let [r, i, ...a] = n._, o = a.join(" ") || t.currentPage.wikiTitle.toText();
				e.execute(`fetch ${o}`);
			} else if (K.test(a || "")) {
				let t = K.exec(a || "")[0];
				e.print(b(q).replace("$1", t));
			} else e.print(b(H));
		}
	};
}
//#endregion
//#region src/commands/index.ts
function Y(e) {
	let t = [
		D(e),
		O(e),
		M(e),
		N(e),
		P(e),
		F(e),
		I(e),
		L(e),
		R(e),
		z(e),
		k(e),
		A(e),
		j(e),
		B(e),
		J(e)
	];
	for (let n of t) e.registry.register(n);
	e.registry.register({
		name: ".init",
		description: "重播首次加载动画",
		usage: ".init",
		action() {
			return T(e);
		}
	}), e.registry.register({
		name: ".uninstall",
		description: "卸载此插件 / Uninstall this plugin",
		usage: ".uninstall [--hey-stupid-dev-you-are-not-funny-remove-this-green-junk-from-my-browser-right-now]",
		options: [{
			name: "hey-stupid-dev-you-are-not-funny-remove-this-green-junk-from-my-browser-right-now",
			type: "boolean",
			description: "确认卸载 / Confirm uninstall"
		}],
		async action(t, n) {
			if (n["hey-stupid-dev-you-are-not-funny-remove-this-green-junk-from-my-browser-right-now"]) {
				t.emit("analytics/event", {
					feature: "ipe-cli",
					subtype: "farewell"
				}), e.setInputEnabled(!1);
				let n = (e) => new Promise((t) => setTimeout(t, e));
				e.print("..."), await n(1e3), e.print("居然真输入这么长一串，服了你了。", m.Highlight), await n(1500), e.print(""), e.print("> 正在关闭 MCP 连接...                        ✓", m.Muted), await n(400), e.print("> 释放神经网络权重...                          ✓", m.Muted), await n(400), e.print("> 清理 Agent 凭证...                          ✓", m.Muted), await n(400), e.print("> 删除聊天记录...                              ✓", m.Muted), await n(600), e.print(""), e.print("^C 退出中断", m.Warning), await n(500), e.print("稍等，让我说最后一句话：", m.Highlight), e.print("再见，伟大的编辑者。祝你写出最好的条目。", m.Highlight), await n(1500), e.print(""), e.print("Farewell. / 永别。", m.Muted), await n(1500), localStorage.removeItem("ipe-cli-booted"), localStorage.removeItem("ipe-cli-history"), localStorage.removeItem("ipe-cli-height"), localStorage.removeItem("ipe-cli-warning-dismissed");
				let r = (await t.preferences.get("pluginStore.plugins", []) || []).filter((e) => e.id === "april-fool-2026");
				for (let e of r) await t.store.uninstallAndRemovePreference(e.registry, e.id);
				return;
			}
			e.print("如需卸载 ipe-cli，请前往 InPageEdit Preferences → Plugin Store，找到此插件并卸载。"), e.print("To uninstall ipe-cli, go to InPageEdit Preferences → Plugin Store, find this plugin and uninstall it."), e.print(""), e.print("或执行 / Or run: .uninstall --hey-stupid-dev-you-are-not-funny-remove-this-green-junk-from-my-browser-right-now", m.Muted);
		}
	});
}
//#endregion
//#region src/index.ts
var X = "ipe-cli-booted", Z = u({
	name: "april-fool-2026",
	inject: ["toolbox"],
	apply(e) {
		let t = new y(e);
		Y(t), t.print(`
┳┏┓┏┓  ┏┓┓ ┳
┃┃┃┣   ┃ ┃ ┃
┻┣┛┗┛  ┗┛┗┛┻
v${e.root.version}`.trim());
		let n = {
			terminal: t,
			command: (e) => t.registry.register(e),
			execute: (e, n) => t.execute(e, n),
			open: () => t.open(),
			close: () => t.close(),
			print: (e, n) => t.print(e, n)
		};
		e.set("tui", n), e.toolbox.addButton({
			id: "ipe-cli-toggle",
			tooltip: "ipe-cli 终端",
			icon: (() => {
				let e = document.createElement("span");
				return e.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" /><path d=\"M8 9l3 3l-3 3\" /><path d=\"M13 15l3 0\" /><path d=\"M3 6a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -12\" /></svg>", e.firstElementChild;
			})(),
			onClick: () => t.toggle()
		}), localStorage.getItem(X) ? E(t) : (localStorage.setItem(X, "1"), t.open(), e.emit("analytics/event", {
			feature: "ipe-cli",
			subtype: "first-boot"
		}), T(t).then(() => {
			e.emit("tui/boot", { ctx: e });
		})), e.on("dispose", () => {
			e.toolbox.removeButton("ipe-cli-toggle"), t.dispose();
		});
	}
});
//#endregion
export { Z as default };

//# sourceMappingURL=index.mjs.map