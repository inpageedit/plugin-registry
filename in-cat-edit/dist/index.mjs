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
//#region ../../node_modules/.pnpm/jsx-dom@8.1.6/node_modules/jsx-dom/index.js
var n = Object.keys;
function r(e) {
	return typeof e == "boolean";
}
function i(e) {
	return e && typeof e.nodeType == "number";
}
function a(e) {
	return typeof e == "string";
}
function o(e) {
	return typeof e == "number";
}
function s(e) {
	return typeof e == "object" ? e !== null : c(e);
}
function c(e) {
	return typeof e == "function";
}
function l(e) {
	return !!(e && e.isComponent);
}
function u(e) {
	return s(e) && typeof e.length == "number" && typeof e.nodeType != "number";
}
function d(e, t) {
	if (e) for (let r of n(e)) t(e[r], r);
}
function f(e) {
	return s(e) && "current" in e;
}
var p = {
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
function m(e, t) {
	return e + t.charAt(0).toUpperCase() + t.substring(1);
}
var h = [
	"Webkit",
	"ms",
	"Moz",
	"O"
];
n(p).forEach((e) => {
	h.forEach((t) => {
		p[m(t, e)] = 0;
	});
});
var g = Symbol.for("jsx-dom:type"), _ = /*#__PURE__*/ (function(e) {
	return e.ShadowRoot = "ShadowRoot", e;
})(_ || {});
function v(e) {
	return e != null && e[g] === _.ShadowRoot;
}
var y = "http://www.w3.org/2000/svg", b = "http://www.w3.org/1999/xlink", x = "http://www.w3.org/XML/1998/namespace";
function S(e) {
	return !r(e) && e != null;
}
function C(e) {
	return Array.isArray(e) ? e.map(C).filter(Boolean).join(" ") : s(e) ? Symbol.iterator in e ? C(Array.from(e)) : n(e).filter((t) => e[t]).join(" ") : S(e) ? "" + e : "";
}
var w = {
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
}, T = /^(a(ll|t|u)|base[FP]|c(al|lipPathU|on)|di|ed|ex|filter[RU]|g(lyphR|r)|ke|l(en|im)|ma(rker[HUW]|s)|n|pat|pr|point[^e]|re[^n]|s[puy]|st[^or]|ta|textL|vi|xC|y|z)/;
function E(e, t, n) {
	t = {
		...t,
		children: n
	};
	let r = new e(t), i = r.render();
	return "ref" in t && O(t.ref, r), i;
}
function D(e, t) {
	let { children: n, ...r } = t;
	!r.namespaceURI && w[e] === 0 && (r = {
		...r,
		namespaceURI: y
	});
	let i;
	if (a(e)) {
		if (i = r.namespaceURI ? document.createElementNS(r.namespaceURI, e) : document.createElement(e), L(r, i), k(n, i), i instanceof window.HTMLSelectElement && r.value != null) if (r.multiple === !0 && Array.isArray(r.value)) {
			let e = r.value.map((e) => String(e));
			i.querySelectorAll("option").forEach((t) => t.selected = e.includes(t.value));
		} else i.value = r.value;
		O(r.ref, i);
	} else if (c(e)) s(e.defaultProps) && (r = {
		...e.defaultProps,
		...r
	}), i = l(e) ? E(e, r, n) : e({
		...r,
		children: n
	});
	else throw TypeError(`Invalid JSX element type: ${e}`);
	return i;
}
function O(e, t) {
	f(e) ? e.current = t : c(e) && e(t);
}
function k(e, t) {
	if (u(e)) A(e, t);
	else if (a(e) || o(e)) j(document.createTextNode(e), t);
	else if (e === null) j(document.createComment(""), t);
	else if (i(e)) j(e, t);
	else if (v(e)) {
		let n = t.attachShadow(e.attr);
		k(e.children, n), O(e.ref, n);
	}
}
function A(e, t) {
	for (let n of [...e]) k(n, t);
	return t;
}
function j(e, t) {
	t instanceof window.HTMLTemplateElement ? t.content.appendChild(e) : t.appendChild(e);
}
function M(e, t) {
	return e.replace(/[A-Z]/g, (e) => t + e.toLowerCase());
}
function N(e, t) {
	t == null || t === !1 || (Array.isArray(t) ? t.forEach((t) => N(e, t)) : a(t) ? e.setAttribute("style", t) : s(t) && d(t, (t, n) => {
		n.indexOf("-") === 0 ? e.style.setProperty(n, t) : o(t) && p[n] !== 0 ? e.style[n] = t + "px" : e.style[n] = t;
	}));
}
function P(e, t, n) {
	switch (e) {
		case "xlinkActuate":
		case "xlinkArcrole":
		case "xlinkHref":
		case "xlinkRole":
		case "xlinkShow":
		case "xlinkTitle":
		case "xlinkType":
			I(n, b, M(e, ":"), t);
			return;
		case "xmlnsXlink":
			F(n, M(e, ":"), t);
			return;
		case "xmlBase":
		case "xmlLang":
		case "xmlSpace":
			I(n, x, M(e, ":"), t);
			return;
	}
	switch (e) {
		case "htmlFor":
			F(n, "for", t);
			return;
		case "dataset":
			d(t, (e, t) => {
				e != null && (n.dataset[t] = e);
			});
			return;
		case "innerHTML":
		case "innerText":
		case "textContent":
			S(t) && (n[e] = t);
			return;
		case "dangerouslySetInnerHTML":
			s(t) && (n.innerHTML = t.__html);
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
			c(t) ? t(n) : F(n, "class", C(t));
			return;
		case "ref":
		case "namespaceURI": return;
		case "style":
			N(n, t);
			return;
		case "on":
		case "onCapture":
			d(t, (t, r) => {
				n.addEventListener(r, t, e === "onCapture");
			});
			return;
	}
	if (c(t)) {
		if (e[0] === "o" && e[1] === "n") {
			let r = e.toLowerCase(), i = r.endsWith("capture");
			if (r === "ondoubleclick" ? r = "ondblclick" : i && r === "ondoubleclickcapture" && (r = "ondblclickcapture"), !i && n[r] === null) n[r] = t;
			else if (i) n.addEventListener(r.substring(2, r.length - 7), t, !0);
			else {
				let i;
				i = r in window ? r.substring(2) : r[2] + e.slice(3), n.addEventListener(i, t);
			}
		}
	} else s(t) ? n[e] = t : t === !0 ? F(n, e, "") : t !== !1 && t != null && (n instanceof SVGElement && !T.test(e) ? F(n, M(e, "-"), t) : F(n, e, t));
}
function F(e, t, n) {
	e.setAttribute(t, n);
}
function I(e, t, n, r) {
	e.setAttributeNS(t, n, r);
}
function L(e, t) {
	for (let r of n(e)) P(r, e[r], t);
	return t;
}
//#endregion
//#region src/index.tsx
var R = ({ isRedLink: e, onClick: t }) => /* @__PURE__ */ D("a", {
	href: "#ipe://quick-edit/",
	class: `ipe-quick-edit ${e ? "ipe-quick-edit--create-only" : ""}`,
	style: "user-select: none; margin-left: 0.2em;",
	onClick: t,
	children: /* @__PURE__ */ D("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		width: "24",
		height: "24",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "2",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		class: "icon icon-tabler icons-tabler-outline icon-tabler-pencil-bolt ipe-icon",
		children: [
			/* @__PURE__ */ D("path", {
				stroke: "none",
				d: "M0 0h24v24H0z",
				fill: "none"
			}),
			/* @__PURE__ */ D("path", { d: "M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" }),
			/* @__PURE__ */ D("path", { d: "M13.5 6.5l4 4" }),
			/* @__PURE__ */ D("path", { d: "M19 16l-2 3h4l-2 3" })
		]
	})
}), z = ({ counterpartTitle: e, isMissing: t, onCounterpartEditClick: n }) => {
	let r = e.equals(e.getSubjectPage()) ? "Main" : "Talk", i = e.getPrefixedText(), a = e.getURL().toString();
	if (t) {
		let e = new URL(a, window.location.origin);
		e.searchParams.set("action", "edit"), e.searchParams.set("redlink", "1"), a = e.pathname + e.search;
	}
	return /* @__PURE__ */ D("span", {
		class: "ipe-in-cat-edit-counterpart",
		children: [
			" (",
			/* @__PURE__ */ D("a", {
				href: a,
				title: i,
				class: t ? "new" : "",
				children: r
			}),
			/* @__PURE__ */ D(R, {
				isRedLink: t,
				onClick: n
			}),
			")"
		]
	});
}, B = t({
	name: "in-cat-edit",
	inject: [
		"quickEdit",
		"inArticleLinks",
		"api",
		"wiki"
	],
	apply: (e) => {
		e.wiki.mwConfig.get("wgNamespaceNumber") === 14 && mw.hook("wikipage.content").add(async (t) => {
			let n = t[0];
			if (!n) return;
			let r = Array.from(n.querySelectorAll(".mw-category, #mw-subcategories, #mw-pages, #mw-category-media")).filter((e, t, n) => !n.some((t) => t !== e && t.contains(e)));
			if (!r.length) return;
			let i = [];
			r.forEach((t) => {
				i.push(...e.inArticleLinks.scanAnchors(t));
			});
			let a = [], o = [];
			for (let { $el: e, title: t } of i) {
				if (!t) continue;
				let n = t.getPrefixedText(), r = V(t), i = {
					$el: e,
					titlePrefixed: n
				};
				if (r) {
					let e = r.getPrefixedText();
					i.counterpart = {
						title: r,
						prefixed: e
					}, o.push(e);
				}
				a.push(i);
			}
			let s = await H(o, e.api);
			for (let { $el: t, titlePrefixed: n, counterpart: r } of a) {
				if (t.dataset.ipeInCatEditProcessed) continue;
				t.dataset.ipeInCatEditProcessed = "1";
				let i = document.createDocumentFragment();
				if (i.appendChild(/* @__PURE__ */ D(R, {
					isRedLink: !1,
					onClick: (t) => {
						t.preventDefault(), e.quickEdit.showModal({
							title: n,
							createOnly: !1
						});
					}
				})), r) {
					let { title: t, prefixed: n } = r, a = s.has(n);
					i.appendChild(/* @__PURE__ */ D(z, {
						counterpartTitle: t,
						isMissing: a,
						onCounterpartEditClick: (t) => {
							t.preventDefault(), e.quickEdit.showModal({
								title: n,
								createOnly: a
							});
						}
					}));
				}
				let a = t.parentNode;
				a && a.insertBefore(i, t.nextSibling);
			}
		});
	}
}), V = (e) => {
	let t = e.getSubjectPage();
	return e.equals(t) ? e.getTalkPage() : t;
}, H = async (e, t, n = 50) => {
	let r = /* @__PURE__ */ new Set(), i = [];
	for (let a = 0; a < e.length; a += n) {
		let o = e.slice(a, a + n);
		i.push(t.post({
			action: "query",
			titles: o.join("|"),
			format: "json",
			formatversion: 2
		}).then((e) => {
			(e.data?.query || e.query)?.pages?.forEach((e) => {
				e.missing && r.add(e.title);
			});
		}).catch((e) => {
			console.error("[in-cat-edit] Failed to check page existence", e);
		}));
	}
	return await Promise.all(i), r;
};
//#endregion
export { B as default };

//# sourceMappingURL=index.mjs.map