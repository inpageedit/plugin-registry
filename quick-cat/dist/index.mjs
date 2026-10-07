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
//#region src/parse.ts
function n(e) {
	return String(e).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var r = [
	"nowiki",
	"pre",
	"code",
	"math",
	"syntaxhighlight",
	"source",
	"timeline",
	"poem",
	"hiero"
];
function i(e, t) {
	let n = 1, r = t + 2;
	for (; r < e.length && n > 0;) e.startsWith("{{", r) ? (n++, r += 2) : e.startsWith("}}", r) ? (n--, r += 2) : r++;
	return n === 0 ? r : -1;
}
function a(e, t) {
	let n = t + 2;
	for (; n < e.length && /\s/.test(e[n]);) n++;
	let r = e.slice(n).toLowerCase();
	return r.startsWith("defaultsort:") || r.startsWith("defaultsortkey:");
}
function o(e) {
	let t = e.replace(/<!--[\s\S]*?-->/g, (e) => " ".repeat(e.length));
	for (let e of r) t = t.replace(RegExp(`<${e}(?:\\s[^>]*)?>[\\s\\S]*?<\\/${e}>`, "gi"), (e) => " ".repeat(e.length));
	let n = t.split("");
	for (let e = 0; e < n.length; e++) {
		if (!t.startsWith("{{", e)) continue;
		let r = i(t, e);
		if (r !== -1) {
			if (a(t, e)) {
				e = r - 1;
				continue;
			}
			for (let t = e; t < r; t++) n[t] = " ";
			e = r - 1;
		}
	}
	return n.join("");
}
function s() {
	let e = {}, t = {};
	try {
		e = mw.config.get("wgNamespaceIds") || {}, t = mw.config.get("wgFormattedNamespaces") || {};
	} catch {}
	let r = Number(e.category) || 14, i = /* @__PURE__ */ new Set(["Category"]);
	for (let [t, n] of Object.entries(e)) Number(n) === r && t && i.add(t);
	return {
		alt: [...i].sort((e, t) => t.length - e.length).map(n).join("|"),
		name: String(t[String(r)]) || "Category"
	};
}
function c() {
	return s();
}
function l(e, t) {
	return String(e).replace(RegExp(`^\\s*(?:${t.alt})\\s*:`, "i"), "").trim();
}
function u(e) {
	let t = [], n = o(e), r = /\{\{\s*(?:DEFAULTSORT|DEFAULTSORTKEY)\s*:\s*/gi, a;
	for (; a = r.exec(n);) {
		let o = i(n, a.index);
		if (o === -1) continue;
		let s = o - 2;
		t.push({
			start: a.index,
			end: s,
			value: e.slice(r.lastIndex, s).trim()
		});
	}
	return t;
}
function d(e, t) {
	let n = [], r = u(e), i = RegExp(`\\[\\[\\s*(?<ns>${t.alt})\\s*:\\s*(?<name>[^\\[\\]|]*?)(?:\\s*\\|\\s*(?<sortkey>[^\\[\\]]*?))?\\s*\\]\\]`, "gi"), a = o(e), s, c = 1;
	for (; s = i.exec(a);) n.push({
		_id: c++,
		ns: s.groups.ns.trim(),
		name: s.groups.name.trim(),
		sortkey: (s.groups.sortkey ?? "").trim(),
		start: s.index,
		end: s.index + s[0].length
	});
	return {
		categories: n,
		defaultSort: r[0]?.value || ""
	};
}
function f(e) {
	let t = u(e), n = e;
	for (let e = t.length - 1; e >= 0; e--) {
		let r = t[e], i = r.start, a = r.end + 2, o = i;
		for (; o > 0 && (n[o - 1] === " " || n[o - 1] === "	");) o--;
		if (o === 0 || n[o - 1] === "\n") {
			i = o;
			let e = a;
			for (; e < n.length && (n[e] === " " || n[e] === "	");) e++;
			n[e] === "\r" && e++, n[e] === "\n" && e++, a = e;
		}
		n = n.slice(0, i) + n.slice(a);
	}
	return n;
}
function p(e, t) {
	let n = o(e), r = [], i;
	for (; i = t.exec(n);) r.push([i.index, i.index + i[0].length]);
	return r;
}
function m(e, t) {
	let n = p(e, RegExp(`\\[\\[\\s*(?:${t.alt})\\s*:[^\\]]*\\]\\]`, "gi")), r = e;
	for (let e = n.length - 1; e >= 0; e--) {
		let [t, i] = n[e], a = t;
		for (; a > 0 && (r[a - 1] === " " || r[a - 1] === "	");) a--;
		if (a === 0 || r[a - 1] === "\n") {
			t = a;
			let e = i;
			for (; e < r.length && (r[e] === " " || r[e] === "	");) e++;
			r[e] === "\r" && e++, r[e] === "\n" && e++, i = e;
		}
		r = r.slice(0, t) + r.slice(i);
	}
	return r;
}
function h(e, t, n) {
	let r = l(e.name, n);
	if (!r) return null;
	let i = String(e.sortkey || "").trim(), a = !!t && i.toLowerCase() === t.toLowerCase(), o = String(e.ns || n.name).trim();
	return i && !a ? `[[${o}:${r}|${i}]]` : `[[${o}:${r}]]`;
}
function g(e, t, n) {
	let r = [];
	t && r.push(`{{DEFAULTSORT:${t}}}`);
	for (let i of e) {
		let e = h(i, t, n);
		e && r.push(e);
	}
	return r;
}
function ee(e, t) {
	if (!e.length && !t.length) return null;
	let n = [...e.map((e) => e.start), ...t.map((e) => e.start)], r = [...e.map((e) => e.end), ...t.map((e) => e.end + 2)];
	return {
		start: Math.min(...n),
		end: Math.max(...r)
	};
}
function te(e, t, n, r) {
	let i = [...n.map((e) => [e.start, e.end]), ...r.map((e) => [e.start, e.end + 2])].sort((e, t) => e[0] - t[0]), a = t.start;
	for (let [t, n] of i) {
		if (t < a || e.slice(a, t).trim() !== "") return !1;
		a = Math.max(a, n);
	}
	return e.slice(a, t.end).trim() === "";
}
function ne(e, t, n) {
	let r = e.slice(0, t.start), i = e.slice(t.end), a = (r.length === 0 || r.endsWith("\n") ? r : r + "\n") + n.join("\n");
	return i.length === 0 ? a += "\n" : i.startsWith("\n") ? a += i : a += "\n" + i, a;
}
function _(e, t) {
	let n = p(e, RegExp(`\\[\\[\\s*(?:${t.alt})\\s*:\\s*[^\\[\\]|]*?(?:\\s*\\|\\s*[^\\[\\]]*?)?\\s*\\]\\]`, "gi"));
	return n.length ? n[n.length - 1][1] : -1;
}
function v(e, t) {
	let n = t.filter((t) => e.some((e) => e._id === t._id)).map((e) => e._id), r = e.filter((e) => e._id != null).map((e) => e._id);
	if (n.join(",") !== r.join(",")) return !0;
	let i = !1;
	for (let t of e) if (t._id == null) i = !0;
	else if (i) return !0;
	return !1;
}
function re(e, t, n, r, i) {
	let a = g(t, n, i), o = u(e), s = ee(r, o);
	if (s && a.length && te(e, s, r, o)) return ne(e, s, a);
	let c = f(e);
	return c = m(c, i), c = c.replace(/[ \t\r\n]+$/, ""), a.length === 0 ? `${c}\n` : `${c}\n${a.join("\n")}\n`;
}
function ie(e, t) {
	let n = [...t].sort((e, t) => t.start - e.start), r = e;
	for (let e of n) r = r.slice(0, e.start) + e.text + r.slice(e.end);
	return r;
}
function ae(e, t, n, r, i) {
	let a = /* @__PURE__ */ new Map();
	for (let e of t) e._id != null && a.set(e._id, e);
	let o = t.filter((e) => e._id == null), s = u(e), c = [];
	for (let t of r) {
		let r = a.get(t._id), o = r ? h(r, n, i) ?? "" : "", s = t.start, l = t.end;
		if (!o) {
			let n = e.lastIndexOf("\n", t.start - 1) + 1, r = e.indexOf("\n", t.end), i = r === -1 ? e.length : r, a = e.slice(n, t.start), o = e.slice(t.end, i);
			/^[ \t]*$/.test(a) && /^[ \t]*$/.test(o) && (s = n, l = i < e.length ? i + 1 : i);
		}
		c.push({
			start: s,
			end: l,
			text: o
		});
	}
	for (let e of s) c.push({
		start: e.start,
		end: e.end + 2,
		text: n ? `{{DEFAULTSORT:${n}}}` : ""
	});
	let l = ie(e, c);
	l = l.replace(/[ \t\r\n]+$/, "");
	let d = [];
	n && !s.length && d.push(`{{DEFAULTSORT:${n}}}`);
	for (let e of o) {
		let t = h(e, n, i);
		t && d.push(t);
	}
	if (d.length === 0) return `${l}\n`;
	let f = _(l, i);
	if (f >= 0) {
		let e = l.slice(f);
		return l = l.slice(0, f) + "\n" + d.join("\n"), e.length && !e.startsWith("\n") && (l += "\n"), l += e, `${l}\n`;
	}
	return `${l}\n${d.join("\n")}\n`;
}
function y(e, t, n, r, i) {
	return v(t, r) ? re(e, t, n, r, i) : ae(e, t, n, r, i);
}
function oe(e, t) {
	return y(e.content, e.categories, e.originalDefaultSort, e.categories, t) === y(e.content, e.rows, e.defaultSort, e.categories, t);
}
//#endregion
//#region src/context.ts
var b = "quick-cat", x = {
	tooltip: "快速分类",
	modalTitle: "快速分类",
	namePh: "分类名",
	sortKeyPh: "排序键",
	drag: "拖动排序",
	selectAll: "全选",
	selectedCount: "已选 {{ $1 }} 项",
	deleteSelected: "删除所选",
	defaultSort: "默认排序键",
	noCategories: "此页面没有直接书写的分类。",
	loadFailed: "分类加载失败",
	invalidTitle: "分类名无效",
	invalidTitleDesc: "分类名不能为空，且不能包含 [ ] | # < > { } 等字符。",
	duplicate: "该分类已存在",
	savedDesc: "页面分类已成功更新。"
}, S = x, C = {
	"zh-hans": x,
	"zh-cn": x,
	"zh-sg": x,
	"zh-my": x,
	zh: x,
	"zh-hant": S,
	"zh-tw": S,
	"zh-hk": S,
	"zh-mo": S,
	en: {
		tooltip: "Quick Cat",
		modalTitle: "Quick Cat",
		namePh: "Category name",
		sortKeyPh: "Sort key",
		drag: "Drag to reorder",
		selectAll: "Select all",
		selectedCount: "{{ $1 }} selected",
		deleteSelected: "Delete selected",
		defaultSort: "Default sort key",
		noCategories: "This page has no directly written categories.",
		loadFailed: "Failed to load categories",
		invalidTitle: "Invalid category name",
		invalidTitleDesc: "Category names cannot be empty or contain [ ] | # < > { }.",
		duplicate: "Category already exists",
		savedDesc: "Page categories have been updated."
	}
}, w = {
	cancel: "Cancel",
	save: "Save",
	add: "Add",
	remove: "Remove",
	minorEdit: "Minor edit",
	reloadAfterSave: "Reload after save",
	noChange: "No changes",
	notEditable: "Not editable",
	tooltipNotEditable: "Not editable",
	saved: "Your changes have been saved.",
	summaryLabel: "Summary",
	submissionError: "Submission Error",
	retry: "You can try to submit again to dismiss the warnings."
};
function se(e) {
	let t = e.logger?.(b) || {
		info: (...e) => console.info("[IPE-QuickCat]", ...e),
		warn: (...e) => console.warn("[IPE-QuickCat]", ...e),
		error: (...e) => console.error("[IPE-QuickCat]", ...e)
	}, n = c(), r = e.i18n;
	if (r?.registerMessages) for (let [e, t] of Object.entries(C)) r.registerMessages(e, t, { namespace: b });
	return {
		ctx: e,
		logger: t,
		nsInfo: n,
		suggestSeq: 0,
		optSeq: 0,
		t: (t, ...n) => {
			let r = w[t] ?? `quick-cat.${t}`;
			if (e.$$) try {
				let t = e.$$(...n)`${r}`;
				if (t && !t.startsWith("(")) return t;
			} catch {}
			return C.en[t] ?? w[t] ?? t;
		}
	};
}
//#endregion
//#region src/dom.ts
var ce = "\n  <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"\n    fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\n    class=\"icon icon-tabler icons-tabler-outline icon-tabler-tag\">\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n    <path d=\"M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />\n    <path d=\"M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3\" />\n  </svg>\n", le = "\n  <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"\n    fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\n    class=\"icon icon-tabler icons-tabler-outline icon-tabler-info-circle\">\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n    <path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" />\n    <path d=\"M12 9h.01\" />\n    <path d=\"M11 12h1v4h1\" />\n  </svg>\n", ue = "\n  <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"\n    fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\n    class=\"icon icon-tabler icons-tabler-outline icon-tabler-plus\" aria-hidden=\"true\">\n    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n    <path d=\"M12 5l0 14\" />\n    <path d=\"M5 12l14 0\" />\n  </svg>\n";
function T(e) {
	return new DOMParser().parseFromString(e.trim(), "image/svg+xml").documentElement;
}
var de = () => T(ce), fe = () => T(le), pe = () => T(ue), E = Object.keys;
function me(e) {
	return typeof e == "boolean";
}
function he(e) {
	return e && typeof e.nodeType == "number";
}
function D(e) {
	return typeof e == "string";
}
function O(e) {
	return typeof e == "number";
}
function k(e) {
	return typeof e == "object" ? e !== null : A(e);
}
function A(e) {
	return typeof e == "function";
}
function ge(e) {
	return !!(e && e.isComponent);
}
function j(e) {
	return k(e) && typeof e.length == "number" && typeof e.nodeType != "number";
}
function M(e, t) {
	if (e) for (let n of E(e)) t(e[n], n);
}
function N(e) {
	return k(e) && "current" in e;
}
var P = {
	animationIterationCount: 0,
	borderImageOutset: 0,
	borderImageSlice: 0,
	borderImageWidth: 0,
	boxFlex: 0,
	boxFlexGroup: 0,
	boxOrdinalGroup: 0,
	columnCount: 0,
	columns: 0,
	flex: 0,
	flexGrow: 0,
	flexPositive: 0,
	flexShrink: 0,
	flexNegative: 0,
	flexOrder: 0,
	gridArea: 0,
	gridRow: 0,
	gridRowEnd: 0,
	gridRowSpan: 0,
	gridRowStart: 0,
	gridColumn: 0,
	gridColumnEnd: 0,
	gridColumnSpan: 0,
	gridColumnStart: 0,
	fontWeight: 0,
	lineClamp: 0,
	lineHeight: 0,
	opacity: 0,
	order: 0,
	orphans: 0,
	tabSize: 0,
	widows: 0,
	zIndex: 0,
	zoom: 0,
	fillOpacity: 0,
	floodOpacity: 0,
	stopOpacity: 0,
	strokeDasharray: 0,
	strokeDashoffset: 0,
	strokeMiterlimit: 0,
	strokeOpacity: 0,
	strokeWidth: 0
};
function F(e, t) {
	return e + t.charAt(0).toUpperCase() + t.substring(1);
}
var I = [
	"Webkit",
	"ms",
	"Moz",
	"O"
];
E(P).forEach((e) => {
	I.forEach((t) => {
		P[F(t, e)] = 0;
	});
});
var L = Symbol.for("jsx-dom:type"), R = /*#__PURE__*/ (function(e) {
	return e.ShadowRoot = "ShadowRoot", e;
})(R || {});
function _e(e) {
	return e != null && e[L] === R.ShadowRoot;
}
var ve = "http://www.w3.org/2000/svg", ye = "http://www.w3.org/1999/xlink", be = "http://www.w3.org/XML/1998/namespace";
function z(e) {
	return !me(e) && e != null;
}
function B(e) {
	return Array.isArray(e) ? e.map(B).filter(Boolean).join(" ") : k(e) ? Symbol.iterator in e ? B(Array.from(e)) : E(e).filter((t) => e[t]).join(" ") : z(e) ? "" + e : "";
}
var xe = {
	animate: 0,
	circle: 0,
	clipPath: 0,
	defs: 0,
	desc: 0,
	ellipse: 0,
	feBlend: 0,
	feColorMatrix: 0,
	feComponentTransfer: 0,
	feComposite: 0,
	feConvolveMatrix: 0,
	feDiffuseLighting: 0,
	feDisplacementMap: 0,
	feDistantLight: 0,
	feFlood: 0,
	feFuncA: 0,
	feFuncB: 0,
	feFuncG: 0,
	feFuncR: 0,
	feGaussianBlur: 0,
	feImage: 0,
	feMerge: 0,
	feMergeNode: 0,
	feMorphology: 0,
	feOffset: 0,
	fePointLight: 0,
	feSpecularLighting: 0,
	feSpotLight: 0,
	feTile: 0,
	feTurbulence: 0,
	filter: 0,
	foreignObject: 0,
	g: 0,
	image: 0,
	line: 0,
	linearGradient: 0,
	marker: 0,
	mask: 0,
	metadata: 0,
	path: 0,
	pattern: 0,
	polygon: 0,
	polyline: 0,
	radialGradient: 0,
	rect: 0,
	stop: 0,
	svg: 0,
	switch: 0,
	symbol: 0,
	text: 0,
	textPath: 0,
	tspan: 0,
	use: 0,
	view: 0
}, Se = /^(a(ll|t|u)|base[FP]|c(al|lipPathU|on)|di|ed|ex|filter[RU]|g(lyphR|r)|ke|l(en|im)|ma(rker[HUW]|s)|n|pat|pr|point[^e]|re[^n]|s[puy]|st[^or]|ta|textL|vi|xC|y|z)/;
function Ce(e, t, n) {
	t = {
		...t,
		children: n
	};
	let r = new e(t), i = r.render();
	return "ref" in t && H(t.ref, r), i;
}
function V(e, t) {
	let { children: n, ...r } = t;
	!r.namespaceURI && xe[e] === 0 && (r = {
		...r,
		namespaceURI: ve
	});
	let i;
	if (D(e)) {
		if (i = r.namespaceURI ? document.createElementNS(r.namespaceURI, e) : document.createElement(e), Ee(r, i), U(n, i), i instanceof window.HTMLSelectElement && r.value != null) if (r.multiple === !0 && Array.isArray(r.value)) {
			let e = r.value.map((e) => String(e));
			i.querySelectorAll("option").forEach((t) => t.selected = e.includes(t.value));
		} else i.value = r.value;
		H(r.ref, i);
	} else if (A(e)) k(e.defaultProps) && (r = {
		...e.defaultProps,
		...r
	}), i = ge(e) ? Ce(e, r, n) : e({
		...r,
		children: n
	});
	else throw TypeError(`Invalid JSX element type: ${e}`);
	return i;
}
function H(e, t) {
	N(e) ? e.current = t : A(e) && e(t);
}
function U(e, t) {
	if (j(e)) we(e, t);
	else if (D(e) || O(e)) W(document.createTextNode(e), t);
	else if (e === null) W(document.createComment(""), t);
	else if (he(e)) W(e, t);
	else if (_e(e)) {
		let n = t.attachShadow(e.attr);
		U(e.children, n), H(e.ref, n);
	}
}
function we(e, t) {
	for (let n of [...e]) U(n, t);
	return t;
}
function W(e, t) {
	t instanceof window.HTMLTemplateElement ? t.content.appendChild(e) : t.appendChild(e);
}
function G(e, t) {
	return e.replace(/[A-Z]/g, (e) => t + e.toLowerCase());
}
function K(e, t) {
	t == null || t === !1 || (Array.isArray(t) ? t.forEach((t) => K(e, t)) : D(t) ? e.setAttribute("style", t) : k(t) && M(t, (t, n) => {
		n.indexOf("-") === 0 ? e.style.setProperty(n, t) : O(t) && P[n] !== 0 ? e.style[n] = t + "px" : e.style[n] = t;
	}));
}
function Te(e, t, n) {
	switch (e) {
		case "xlinkActuate":
		case "xlinkArcrole":
		case "xlinkHref":
		case "xlinkRole":
		case "xlinkShow":
		case "xlinkTitle":
		case "xlinkType":
			J(n, ye, G(e, ":"), t);
			return;
		case "xmlnsXlink":
			q(n, G(e, ":"), t);
			return;
		case "xmlBase":
		case "xmlLang":
		case "xmlSpace":
			J(n, be, G(e, ":"), t);
			return;
	}
	switch (e) {
		case "htmlFor":
			q(n, "for", t);
			return;
		case "dataset":
			M(t, (e, t) => {
				e != null && (n.dataset[t] = e);
			});
			return;
		case "innerHTML":
		case "innerText":
		case "textContent":
			z(t) && (n[e] = t);
			return;
		case "dangerouslySetInnerHTML":
			k(t) && (n.innerHTML = t.__html);
			return;
		case "value":
			if (t == null || n instanceof window.HTMLSelectElement) return;
			if (n instanceof window.HTMLTextAreaElement) {
				n.value = t;
				return;
			}
			break;
		case "spellCheck":
			n.spellcheck = t;
			return;
		case "class":
		case "className":
			A(t) ? t(n) : q(n, "class", B(t));
			return;
		case "ref":
		case "namespaceURI": return;
		case "style":
			K(n, t);
			return;
		case "on":
		case "onCapture":
			M(t, (t, r) => {
				n.addEventListener(r, t, e === "onCapture");
			});
			return;
	}
	if (A(t)) {
		if (e[0] === "o" && e[1] === "n") {
			let r = e.toLowerCase(), i = r.endsWith("capture");
			if (r === "ondoubleclick" ? r = "ondblclick" : i && r === "ondoubleclickcapture" && (r = "ondblclickcapture"), !i && n[r] === null) n[r] = t;
			else if (i) n.addEventListener(r.substring(2, r.length - 7), t, !0);
			else {
				let i;
				i = r in window ? r.substring(2) : r[2] + e.slice(3), n.addEventListener(i, t);
			}
		}
	} else k(t) ? n[e] = t : t === !0 ? q(n, e, "") : t !== !1 && t != null && (n instanceof SVGElement && !Se.test(e) ? q(n, G(e, "-"), t) : q(n, e, t));
}
function q(e, t, n) {
	e.setAttribute(t, n);
}
function J(e, t, n, r) {
	e.setAttributeNS(t, n, r);
}
function Ee(e, t) {
	for (let n of E(e)) Te(n, e[n], t);
	return t;
}
//#endregion
//#region src/autocomplete.tsx
var De = 300 * 1e3, Y = /* @__PURE__ */ new WeakMap();
function Oe(e) {
	let t = Y.get(e);
	return t || (t = /* @__PURE__ */ new Map(), Y.set(e, t)), t;
}
async function ke(e, t) {
	let n = l(t, e.nsInfo);
	if (!n) return [];
	let r = Oe(e.ctx), i = r.get(n);
	if (i && Date.now() - i.ts < De) return i.items;
	let a = Number(mw.config.get("wgNamespaceIds")?.category) || 14;
	try {
		let [t, i] = await Promise.all([e.ctx.api.get({
			action: "opensearch",
			search: n,
			namespace: a,
			limit: 10
		}), e.ctx.api.get({
			action: "query",
			generator: "allpages",
			gapnamespace: a,
			gapprefix: n,
			gaplimit: 10,
			prop: "info"
		})]), o = t?.data?.[1] || [], s = Object.values(i?.data?.query?.pages || {}).filter((e) => e && !e.missing && e.title).map((e) => e.title), c = /* @__PURE__ */ new Set(), u = [];
		for (let t of [...o, ...s]) {
			let n = l(t, e.nsInfo);
			!n || c.has(n) || (c.add(n), u.push(t));
		}
		let d = /* @__PURE__ */ new Map();
		if (u.length) try {
			let { data: t } = await e.ctx.api.get({
				action: "query",
				prop: "info",
				titles: u.join("|")
			}), n = Object.values(t?.query?.pages || {}).filter((e) => e && (typeof e.redirect == "string" || e.redirect === !0)).map((e) => e.title);
			if (n.length) {
				let { data: t } = await e.ctx.api.get({
					action: "query",
					redirects: 1,
					prop: "info",
					titles: n.join("|")
				});
				for (let e of t?.query?.redirects || []) e.from && e.to && d.set(e.from, e.to);
			}
		} catch (t) {
			e.logger.warn("resolve redirect targets failed:", t);
		}
		let f = u.map((t) => {
			let n = d.get(t);
			return {
				name: l(t, e.nsInfo),
				redirect: n ? l(n, e.nsInfo) : null
			};
		});
		return f.sort((e, t) => {
			let r = e.name, i = t.name;
			if (r === i) return 0;
			if (r.indexOf(i) === 0) return 1;
			if (i.indexOf(r) === 0) return -1;
			let a = +(r.indexOf(n) === 0), o = +(i.indexOf(n) === 0);
			if (a !== o) return o - a;
			let s = r.toLowerCase(), c = i.toLowerCase(), l = n.toLowerCase(), u = +(s.indexOf(l) === 0), d = +(c.indexOf(l) === 0);
			return u === d ? s < c ? -1 : +(c < s) : d - u;
		}), r.set(n, {
			ts: Date.now(),
			items: f
		}), f;
	} catch (t) {
		return e.logger.warn("searchCategories failed:", t), [];
	}
}
function Ae(e, t, n, r, i = {}) {
	let a = null, o = () => {
		r.remove(), r.textContent = "", f = [], p = 0, n.setAttribute("aria-expanded", "false"), n.removeAttribute("aria-activedescendant"), a &&= (a.disconnect(), null);
	}, s = () => {
		a || typeof MutationObserver > "u" || (a = new MutationObserver(() => {
			n.isConnected || o();
		}), document.body && a.observe(document.body, {
			childList: !0,
			subtree: !0
		}));
	}, c = () => {
		if (!r.children.length) return;
		if (!n.isConnected) {
			o();
			return;
		}
		let e = n.getBoundingClientRect(), t = window.innerHeight, i = t - e.bottom, a = e.top;
		r.style.width = `${Math.max(e.width, 140)}px`, i >= 200 || i >= a ? (r.style.top = `${e.bottom + 4}px`, r.style.bottom = "auto", r.style.maxHeight = `${Math.max(60, Math.min(220, i - 8))}px`) : (r.style.top = "auto", r.style.bottom = `${t - e.top + 4}px`, r.style.maxHeight = `${Math.max(60, Math.min(220, a - 8))}px`), r.style.left = `${e.left}px`, r.style.display = "block", r.parentElement !== document.body && document.body.appendChild(r);
	}, u = null, d = 0, f = [], p = 0;
	n.setAttribute("role", "combobox"), n.setAttribute("aria-autocomplete", "list"), n.setAttribute("aria-expanded", "false"), r.id = r.id || `ipe-quick-cat__suggest-${++e.suggestSeq}`, n.setAttribute("aria-controls", r.id), r.setAttribute("role", "listbox");
	let m = (e) => {
		f.length && (p = (e + f.length) % f.length, f.forEach((e, t) => {
			let n = t === p;
			e.classList.toggle("is-active", n), e.setAttribute("aria-selected", String(n));
		}), n.setAttribute("aria-activedescendant", f[p].id), f[p].scrollIntoView({ block: "nearest" }));
	}, h = (t) => {
		if (r.textContent = "", f = [], !t.length) {
			o();
			return;
		}
		for (let a of t) {
			let t = !!a.redirect, s = /* @__PURE__ */ V("button", {
				id: `ipe-quick-cat__opt-${++e.optSeq}`,
				className: t ? "ipe-quick-cat__suggest-item is-redirect" : "ipe-quick-cat__suggest-item",
				type: "button",
				role: "option",
				"aria-selected": "false",
				title: t && a.redirect || void 0,
				onClick: () => {
					let e = t ? a.redirect ?? a.name : a.name;
					i.onPick ? i.onPick(e) : n.value = e, o(), n.focus();
				},
				children: a.name
			});
			t && s.append(/* @__PURE__ */ V("span", {
				className: "ipe-quick-cat__suggest-redirect",
				children: `→ ${a.redirect}`
			})), f.push(s), r.append(s);
		}
		n.setAttribute("aria-expanded", "true"), m(0), s(), c();
	};
	n.addEventListener("input", () => {
		u && clearTimeout(u);
		let r = l(n.value, e.nsInfo);
		if (!r) {
			o();
			return;
		}
		let i = ++d;
		u = setTimeout(() => {
			ke(e, r).then((e) => {
				t.isDestroyed || i !== d || h(e);
			}).catch(() => o());
		}, 200);
	}), n.addEventListener("keydown", (e) => {
		e.key === "ArrowDown" ? (e.preventDefault(), f.length && m(p + 1)) : e.key === "ArrowUp" ? (e.preventDefault(), f.length && m(p - 1)) : e.key === "Enter" ? (e.preventDefault(), f.length ? f[p]?.click() : i.onEnter && i.onEnter()) : e.key === "Escape" && (o(), n.blur());
	});
	let g = (e) => {
		if (t.isDestroyed) {
			document.removeEventListener("click", g);
			return;
		}
		!r.contains(e.target) && !n.contains(e.target) && o();
	};
	document.addEventListener("click", g), t.on(t.Event.Close, () => {
		o(), document.removeEventListener("click", g);
	});
}
//#endregion
//#region src/categoryState.ts
function je(e, t, n) {
	n ? e.selected.add(t) : e.selected.delete(t);
}
function Me(e, t) {
	t ? e.rows.forEach((t) => e.selected.add(t)) : e.selected.clear();
}
function Ne(e, t) {
	e.rows = e.rows.filter((e) => e !== t), e.selected.delete(t);
}
function Pe(e) {
	e.selected.size && (e.rows = e.rows.filter((t) => !e.selected.has(t)), e.selected.clear());
}
function Fe(e, t) {
	e._dragIndex = e.rows.indexOf(t);
}
function Ie(e) {
	e._dragIndex = null;
}
function Le(e, t) {
	if (e._dragIndex == null) return;
	let n = e._dragIndex, [r] = e.rows.splice(n, 1), i = n < t ? t - 1 : t;
	e.rows.splice(i, 0, r), e._dragIndex = null;
}
//#endregion
//#region src/index.tsx
var X = Symbol.for("ipe-quick-cat.applied"), Z = "[IPE-NEXT] Quick Cat", Q = /* @__PURE__ */ new Map();
async function $(e) {
	let { ctx: t, logger: n } = e, r = "visualeditor-dialog-meta-categories-defaultsort-help", i = "zh";
	try {
		i = mw.config.get("wgContentLanguage") || mw.config.get("wgUserLanguage") || i;
	} catch {}
	if (Q.has(i)) return Q.get(i);
	try {
		let { data: e } = await t.api.get({
			action: "query",
			meta: "allmessages",
			ammessages: r,
			amlang: i,
			amincludelocal: 1
		}), a = e?.query?.allmessages?.[0], o = a && (a["*"] || a.content);
		if (a && !a.missing && o && o !== r) return Q.set(i, o), n.info("default sort help resolved via API (lang=" + i + ")"), o;
		n.warn("default sort help: API returned no message (lang=" + i + ")");
	} catch (e) {
		n.warn("getDefaultSortHelp api failed:", e);
	}
	try {
		if (mw.msg) {
			let e = mw.msg(r);
			if (e && e !== r && !/^[⧼([<]/.test(e)) return Q.set(i, e), e;
		}
	} catch {}
	return Q.set(i, "You can override how this page is sorted when displayed within a category by setting a different index to sort with instead. This is often used to make pages about people show by last name, but be named with their first name shown first."), n.warn("default sort help: fell back to built-in English"), Q.get(i);
}
function Re(e, t, n, r, i, a) {
	let { t: o } = e, s = /* @__PURE__ */ V("div", { className: "ipe-quick-cat__row" }), c = /* @__PURE__ */ V("input", {
		className: "ipe-quick-cat__check",
		type: "checkbox",
		checked: n.selected.has(r)
	});
	c.addEventListener("change", () => {
		je(n, r, c.checked), a();
	});
	let l = /* @__PURE__ */ V("span", {
		className: "ipe-quick-cat__grip",
		title: o("drag"),
		"aria-label": o("drag"),
		children: "⠿"
	});
	l.addEventListener("pointerdown", (e) => {
		e.pointerType === "mouse" && e.button !== 0 || (e.preventDefault(), Fe(n, r), l.setPointerCapture(e.pointerId), s.classList.add("is-dragging"));
	});
	let u = /* @__PURE__ */ V("input", {
		className: "ipe-quick-cat__name",
		type: "text",
		value: r.name,
		placeholder: o("namePh"),
		spellCheck: !1,
		autoComplete: "off"
	});
	u.addEventListener("input", () => {
		r.name = u.value.trim();
	});
	let d = /* @__PURE__ */ V("div", { className: "ipe-quick-cat__suggest" });
	Ae(e, t, u, d, {
		onPick: (e) => {
			r.name = e, u.value = e;
		},
		onEnter: () => p.focus()
	});
	let f = /* @__PURE__ */ V("span", {
		className: "ipe-quick-cat__namewrap",
		children: [u, d]
	}), p = /* @__PURE__ */ V("input", {
		className: "ipe-quick-cat__sortkey",
		type: "text",
		value: r.sortkey,
		placeholder: o("sortKeyPh")
	});
	p.addEventListener("input", () => {
		r.sortkey = p.value.trim();
	});
	let m = /* @__PURE__ */ V("button", {
		className: "ipe-quick-cat__remove",
		type: "button",
		title: o("remove"),
		"aria-label": o("remove"),
		onClick: () => {
			Ne(n, r), i(), a();
		},
		children: "✕"
	});
	return s.append(c, l, f, p, m), s;
}
function ze(e, t, n, r, i) {
	let { t: a } = e, o = /* @__PURE__ */ V("input", {
		className: "ipe-quick-cat__checkall",
		type: "checkbox"
	}), s = /* @__PURE__ */ V("span", {
		className: "ipe-quick-cat__selected-count",
		children: a("selectedCount", 0)
	}), c = /* @__PURE__ */ V("button", {
		className: "ipe-quick-cat__add-row",
		type: "button",
		children: [pe(), a("add")]
	});
	c.addEventListener("click", i);
	let l = /* @__PURE__ */ V("button", {
		className: "ipe-quick-cat__delete-selected",
		type: "button",
		disabled: !0,
		children: a("deleteSelected")
	}), u = () => {
		let e = t.rows.length, n = t.selected.size;
		o.checked = e > 0 && n === e, o.indeterminate = n > 0 && n < e, s.textContent = a("selectedCount", n), l.disabled = n === 0;
	};
	return o.addEventListener("change", () => {
		Me(t, o.checked), n.querySelectorAll(".ipe-quick-cat__row").forEach((e) => {
			let t = e.querySelector(".ipe-quick-cat__check");
			t && (t.checked = o.checked);
		}), u();
	}), l.addEventListener("click", () => {
		Pe(t), r(), u();
	}), {
		toolbar: /* @__PURE__ */ V("div", {
			className: "ipe-quick-cat__toolbar",
			children: [
				/* @__PURE__ */ V("label", {
					className: "ipe-quick-cat__checkbox",
					children: [o, /* @__PURE__ */ V("span", { children: a("selectAll") })]
				}),
				s,
				c,
				l
			]
		}),
		refreshToolbar: u
	};
}
function Be(e, t, n) {
	let r = (e) => {
		let n = [...t.querySelectorAll(".ipe-quick-cat__row")];
		for (let t = 0; t < n.length; t++) {
			let r = n[t].getBoundingClientRect();
			if (e < r.top + r.height / 2) return t;
		}
		return n.length;
	}, i = () => {
		t.querySelectorAll(".ipe-quick-cat__row").forEach((e) => e.classList.remove("is-drop-before", "is-drop-after"));
	};
	t.addEventListener("pointermove", (n) => {
		if (e._dragIndex == null) return;
		n.preventDefault();
		let a = t.getBoundingClientRect();
		n.clientY < a.top + 32 ? t.scrollTop -= 8 : n.clientY > a.bottom - 32 && (t.scrollTop += 8), i();
		let o = r(n.clientY), s = [...t.querySelectorAll(".ipe-quick-cat__row")];
		o < s.length ? s[o].classList.add("is-drop-before") : s.length && s[s.length - 1].classList.add("is-drop-after");
	}), t.addEventListener("pointerup", (t) => {
		e._dragIndex != null && (Le(e, r(t.clientY)), n());
	}), t.addEventListener("pointercancel", () => {
		Ie(e), t.querySelectorAll(".ipe-quick-cat__row").forEach((e) => e.classList.remove("is-dragging", "is-drop-before", "is-drop-after"));
	});
}
function Ve(e, t, n, r) {
	let { t: i } = e, a = /* @__PURE__ */ V("input", {
		className: "ipe-quick-cat__ds-input",
		type: "text",
		value: n.defaultSort,
		placeholder: n.defaultSortKey || ""
	});
	a.addEventListener("input", () => {
		let e = n.defaultSort, t = a.value.trim();
		if (n.defaultSort = t, e && e.toLowerCase() !== t.toLowerCase()) {
			let i = (t) => !!t && t.toLowerCase() === e.toLowerCase();
			n.rows.forEach((e) => {
				i(e.sortkey) && (e.sortkey = t);
			}), r.querySelectorAll(".ipe-quick-cat__row").forEach((e, t) => {
				let r = n.rows[t];
				if (r) {
					let t = e.querySelector(".ipe-quick-cat__sortkey");
					t && (t.value = r.sortkey);
				}
			});
		}
	});
	let o = /* @__PURE__ */ V("button", {
		className: "ipe-quick-cat__ds-info",
		type: "button",
		"aria-label": i("defaultSort"),
		onClick: () => {
			$(e).then((n) => {
				t.isDestroyed || e.ctx.modal.notify("info", {
					title: i("defaultSort"),
					content: n,
					closeAfter: 8e3
				});
			});
		},
		children: fe()
	});
	return /* @__PURE__ */ V("label", {
		className: "ipe-quick-cat__ds",
		children: [
			/* @__PURE__ */ V("span", {
				className: "ipe-quick-cat__ds-text",
				children: i("defaultSort")
			}),
			o,
			a
		]
	});
}
function He(e, t) {
	let { t: n } = e, r = /* @__PURE__ */ V("input", {
		id: "ipe-quick-cat__summary",
		className: "ipe-quick-cat__summary-input",
		type: "text",
		value: t.summary || ""
	});
	r.addEventListener("input", () => {
		t.summary = r.value.trim();
	});
	let i = /* @__PURE__ */ V("input", {
		type: "checkbox",
		checked: t.minor
	});
	i.addEventListener("change", () => {
		t.minor = i.checked;
	});
	let a = /* @__PURE__ */ V("input", {
		type: "checkbox",
		checked: t.reloadAfterSave
	});
	return a.addEventListener("change", () => {
		t.reloadAfterSave = a.checked;
	}), /* @__PURE__ */ V("div", {
		className: "ipe-quick-cat__options",
		children: [/* @__PURE__ */ V("div", {
			className: "ipe-quick-cat__summary-wrap",
			children: [/* @__PURE__ */ V("label", {
				className: "ipe-quick-cat__summary-label",
				htmlFor: "ipe-quick-cat__summary",
				children: n("summaryLabel")
			}), r]
		}), /* @__PURE__ */ V("div", {
			className: "ipe-quick-cat__options-row",
			children: [/* @__PURE__ */ V("label", {
				className: "ipe-quick-cat__checkbox",
				children: [i, /* @__PURE__ */ V("span", { children: n("minorEdit") })]
			}), /* @__PURE__ */ V("label", {
				className: "ipe-quick-cat__checkbox",
				children: [a, /* @__PURE__ */ V("span", { children: n("reloadAfterSave") })]
			})]
		})]
	});
}
function Ue(e, t) {
	let { ctx: n, t: r } = e, i = String(t?.message || t);
	n.modal.notify("warning", {
		title: r("submissionError"),
		content: /* @__PURE__ */ V("div", { children: [/* @__PURE__ */ V("p", { children: /* @__PURE__ */ V("strong", { children: i }) }), /* @__PURE__ */ V("p", { children: r("retry") })] }),
		closeAfter: 15e3
	});
}
function We(e, t, n) {
	let { t: r } = e, i = /* @__PURE__ */ V("div", { className: "ipe-quick-cat" }), a = /* @__PURE__ */ V("div", { className: "ipe-quick-cat__list" }), o = () => {}, { toolbar: s, refreshToolbar: c } = ze(e, n, a, () => o(), () => {
		n.rows.push({
			name: "",
			sortkey: n.defaultSort,
			ns: null
		}), o();
		let e = a.querySelectorAll(".ipe-quick-cat__row");
		(e[e.length - 1]?.querySelector(".ipe-quick-cat__name"))?.focus();
	});
	o = () => {
		if (a.textContent = "", n.rows.length === 0) a.append(/* @__PURE__ */ V("div", {
			className: "ipe-quick-cat__empty",
			children: r("noCategories")
		}));
		else for (let r of n.rows) a.append(Re(e, t, n, r, o, c));
		c();
	}, Be(n, a, o), o();
	let l = Ve(e, t, n, a), u = He(e, n);
	i.append(l, a, s, u), t.setContent(i);
}
async function Ge(e, t, n) {
	if (!n) return;
	let { modal: r } = e.ctx, { t: i, logger: a, nsInfo: o } = e;
	if (n.rows.find((e) => e._id != null && !e.name || e.name && /[\[\]|#<>{}]/.test(e.name))) {
		r.notify("error", {
			title: i("invalidTitle"),
			content: i("invalidTitleDesc")
		});
		return;
	}
	let s = /* @__PURE__ */ new Set();
	for (let e of n.rows) {
		if (!e.name) continue;
		let t = l(e.name, o).toLowerCase();
		if (s.has(t)) {
			r.notify("error", {
				title: i("duplicate"),
				content: l(e.name, o)
			});
			return;
		}
		s.add(t);
	}
	if (oe(n, o)) {
		r.notify("info", { title: i("noChange") });
		return;
	}
	let c = y(n.content, n.rows, n.defaultSort, n.categories, o);
	t.setLoadingState(!0);
	try {
		await n.page.edit({
			text: c,
			summary: n.summary || Z,
			minor: n.minor,
			...n.forceSave || n.page.lastrevid <= 0 ? {} : { baserevid: n.page.lastrevid }
		}), e.ctx.emit("analytics/event", {
			feature: "quick-cat",
			subtype: "save",
			page: n.title
		}), t.isDestroyed || t.close(), n.reloadAfterSave ? (r.notify("success", {
			title: i("saved"),
			content: i("savedDesc"),
			closeAfter: 900
		}), setTimeout(() => window.location.reload(), 1e3)) : r.notify("success", {
			title: i("saved"),
			content: i("savedDesc"),
			closeAfter: 3e3
		});
	} catch (t) {
		a.error("save failed:", t);
		let o = t?.code || t?.data?.error?.code;
		if (o === "pagedeleted" || o === "editconflict") {
			n.forceSave = !0, Ue(e, t);
			return;
		}
		r.notify("error", {
			title: i("submissionError"),
			content: String(t?.message || t)
		});
	} finally {
		t.isDestroyed || t.setLoadingState(!1);
	}
}
async function Ke(e) {
	let { ctx: t, logger: n, t: r, nsInfo: i } = e, a = t.modal, o = t.currentPage?.wikiTitle?.getPrefixedText?.() || (mw.config.get("wgPageName") || "").replace(/_/g, " ");
	if (!o) {
		a.notify("warning", {
			title: r("modalTitle"),
			content: r("notEditable")
		});
		return;
	}
	let [s, c, l] = await Promise.all([
		t.preferences.get("quickCat.defaultSummary"),
		t.preferences.get("quickCat.defaultMinor"),
		t.preferences.get("quickCat.outSideClose")
	]), u = String(s ?? ""), f = !!c, p = !!l, m = a.createObject({
		title: `${r("modalTitle")}: ${o}`,
		content: /* @__PURE__ */ V("div", { className: "ipe-quick-cat ipe-quick-cat--loading" }),
		className: "compact-buttons",
		sizeClass: "smallToMedium",
		center: !0,
		outSideClose: p
	}).init();
	{
		let e = document.createDocumentFragment();
		e.append(document.createTextNode(`${r("modalTitle")}: `)), e.append(/* @__PURE__ */ V("u", { children: o })), m.setTitle(e);
	}
	let h = null;
	m.addButton({
		side: "right",
		type: "button",
		className: "is-danger is-ghost",
		label: r("cancel"),
		method: () => m.close()
	}), m.addButton({
		side: "right",
		type: "button",
		className: "is-primary is-ghost",
		label: r("save"),
		method: () => Ge(e, m, h)
	}), m.show(), m.setLoadingState(!0);
	try {
		let n = await t.wikiPage.newFromTitle(o), r = n.revisions?.[0]?.content ?? "", a = d(r, i);
		h = {
			title: o,
			defaultSortKey: mw.config.get("wgTitle") || "",
			pageName: t.currentPage?.wikiTitle?.getPrefixedText?.() || (mw.config.get("wgPageName") || o).replace(/_/g, " "),
			page: n,
			content: r,
			categories: a.categories,
			originalDefaultSort: a.defaultSort,
			defaultSort: a.defaultSort,
			summary: u,
			minor: f,
			reloadAfterSave: !0,
			forceSave: !1,
			selected: /* @__PURE__ */ new Set(),
			_dragIndex: null,
			rows: a.categories.map((e) => ({
				_id: e._id,
				name: e.name,
				sortkey: e.sortkey || a.defaultSort,
				ns: e.ns || null
			}))
		}, We(e, m, h), e.ctx.emit("analytics/event", {
			feature: "quick-cat",
			subtype: void 0,
			page: h.title
		});
	} catch (e) {
		n.error("load failed:", e), m.setContent(/* @__PURE__ */ V("div", {
			className: "ipe-quick-cat ipe-quick-cat--error",
			children: [/* @__PURE__ */ V("p", { children: r("loadFailed") }), /* @__PURE__ */ V("p", {
				className: "ipe-quick-cat__errmsg",
				children: String(e?.message || e)
			})]
		})), a.notify("error", {
			title: r("loadFailed"),
			content: String(e?.message || e)
		});
	} finally {
		m.isDestroyed || m.setLoadingState(!1);
	}
	return m;
}
var qe = t({
	name: b,
	inject: [
		"toolbox",
		"modal",
		"wikiPage",
		"api",
		"i18n"
	],
	apply(e) {
		let t = e, n = t.schema;
		if (t[X]) return;
		t[X] = !0;
		let r = se(t);
		t.preferences?.registerCustomConfig?.(b, n.object({
			"quickCat.defaultSummary": n.string().description("Default summary of the quick cat").default(Z),
			"quickCat.defaultMinor": n.boolean().description("Default to checking \"minor edit\" option").default(!1),
			"quickCat.outSideClose": n.boolean().description("Close editor modal by clicking outside").default(!1)
		}).description("Quick Cat options"), "editor");
		let i = "view";
		try {
			let e = t.currentPage?.wikiAction;
			i = typeof e == "string" && e || mw.config.get("wgAction") || "view";
		} catch {}
		let a = !!mw.config.get("wgIsProbablyEditable") && i === "view";
		t.toolbox.addButton({
			id: b,
			group: "group2",
			index: 0,
			icon: de(),
			tooltip: () => a ? r.t("tooltip") : r.t("tooltipNotEditable"),
			buttonProps: a ? void 0 : { style: {
				cursor: "not-allowed",
				filter: "grayscale(50%) opacity(.75)"
			} },
			onClick: (e) => {
				e.preventDefault(), a && Ke(r);
			}
		}), t.on("dispose", () => {
			t.toolbox.removeButton(b);
		});
	}
});
//#endregion
export { qe as default };

//# sourceMappingURL=index.mjs.map