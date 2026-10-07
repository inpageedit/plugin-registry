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
var t = class {
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
}, n = Object.keys;
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
function R(e) {
	let t = new Text();
	Object.defineProperty(t, "toString", { value() {
		return this.textContent;
	} });
	function n(e) {
		t.textContent = e;
	}
	return e != null && n(e), [t, n];
}
//#endregion
//#region src/index.tsx
var z = () => {
	let e = /* @__PURE__ */ Error("Aborted");
	return e.name = "AbortError", e;
}, B = (e) => new Promise((t) => setTimeout(t, e)), V = (e, t) => t ? t.aborted ? Promise.reject(z()) : new Promise((n, r) => {
	let i = setTimeout(() => {
		t.removeEventListener("abort", a), n();
	}, e), a = () => {
		clearTimeout(i), t.removeEventListener("abort", a), r(z());
	};
	t.addEventListener("abort", a, { once: !0 });
}) : B(e), H = class extends t {
	static {
		this.using = [
			"api",
			"currentPage",
			"wiki",
			"wikiPage",
			"modal",
			"preferences"
		];
	}
	constructor(e) {
		super(e, {}, "quick-delete"), this.ctx = e, this._modal = null, e.set("quickDelete", this);
	}
	start() {
		this.ctx.inject(["toolbox"], (e) => {
			this.injectToolbox(e), e.on("dispose", () => {
				this.removeToolbox(e);
			});
		}), this.ctx.inject(["analytics"], (e) => {
			e.on("quick-delete/delete-one", (t) => {
				e.analytics.addEvent("quick-delete", "delete-one", t.wikiPage.title);
			});
		});
		let e = this.ctx.schema;
		this.ctx.preferences.registerCustomConfig("quick-delete", e.object({ "quickDelete.reason": e.string().description("Default delete reason for quick delete").default("[IPE-NEXT] Quick delete") }).description("Quick delete options").extra("category", "editor"), "editor");
	}
	stop() {
		this._modal && this._modal.close();
	}
	async showModal(e) {
		this._modal && this._modal.close(), e = {
			titles: [],
			deleteReason: await this.ctx.preferences.get("quickDelete.reason") || "",
			reloadAfterDelete: !0,
			...e
		}, this.ctx.emit("quick-delete/init-options", {
			ctx: this.ctx,
			options: e
		});
		let t = this.ctx.modal.show({
			title: "Batch Delete",
			sizeClass: "dialog"
		}), n = /* @__PURE__ */ D("textarea", {
			name: "titles",
			id: "titles",
			rows: 10,
			placeholder: "Enter the titles of the pages you want to delete, one per line.",
			children: [e.titles.join("\n"), "\n"]
		}), r = /* @__PURE__ */ D("form", {
			className: "ipe-quickDelete-modal",
			style: {
				display: "grid",
				gap: "1rem"
			},
			children: [
				/* @__PURE__ */ D("div", {
					className: "ipe-input-box",
					children: [/* @__PURE__ */ D("label", {
						htmlFor: "titles",
						children: "Enter the titles of the pages you want to delete, one per line."
					}), n]
				}),
				/* @__PURE__ */ D("div", {
					className: "ipe-input-box",
					children: [/* @__PURE__ */ D("label", {
						htmlFor: "reason",
						children: "Reason"
					}), /* @__PURE__ */ D("input", {
						type: "text",
						name: "reason",
						id: "reason",
						value: e.deleteReason,
						placeholder: "Enter the reason for deletion."
					})]
				}),
				/* @__PURE__ */ D("div", {
					className: "ipe-input-box",
					children: /* @__PURE__ */ D("label", {
						className: "ipe-checkbox",
						children: [
							/* @__PURE__ */ D("input", {
								type: "checkbox",
								id: "deletetalk",
								name: "deletetalk"
							}),
							/* @__PURE__ */ D("span", { className: "ipe-checkbox-box" }),
							/* @__PURE__ */ D("span", { children: "Delete talk pages, if exists" })
						]
					})
				})
			]
		});
		return t.setContent(r), t.setButtons([{
			label: "Cancel",
			method: () => {
				t.close();
			}
		}, {
			label: "Delete",
			className: "is-danger",
			method: async () => {
				let e = new FormData(r), i = e.get("titles"), a = e.get("reason"), o = e.get("deletetalk") === "on", s = Array.from(new Set(i.split("\n").map((e) => e.trim()).filter(Boolean)));
				n.value = s.join("\n") + "\n";
				let c = s.length;
				if (c === 0) return;
				t.setLoadingState(!0);
				let l = new AbortController(), u = [], d = [], f = !1, p = this.ctx.modal.show({
					title: "Deleting...",
					closeIcon: !1,
					outSideClose: !1,
					sizeClass: "dialog",
					buttons: [{
						id: "abort-delete-button",
						label: "Cancel",
						className: "is-danger is-text",
						method: () => {
							f = !0, l.abort();
						}
					}]
				}), [m, h] = R("0"), [g, _] = R("-"), [v, y] = R("0"), [b, x] = R("0"), [S, C] = R(c.toString()), [w, T] = R("Cancel will stop subsequent deletions (effective after the current request finishes)."), E = /* @__PURE__ */ D("ul", { style: { margin: "0.25rem 0 0 1.25rem" } }), O = (e, t, n) => {
					let r = /* @__PURE__ */ D("li", { children: [
						/* @__PURE__ */ D("span", {
							style: { color: e === "success" ? "var(--ipe-modal-success)" : e === "fail" ? "var(--ipe-modal-danger)" : "var(--ipe-modal-text-secondary)" },
							children: e === "success" ? "✔ " : e === "fail" ? "✖ " : "• "
						}),
						/* @__PURE__ */ D("strong", { children: t }),
						n ? /* @__PURE__ */ D("span", { children: [" — ", n] }) : null
					] });
					E.appendChild(r);
				};
				p.setContent(/* @__PURE__ */ D("div", {
					className: "theme-ipe-prose",
					style: {
						display: "grid",
						gap: "0.75rem"
					},
					children: [
						/* @__PURE__ */ D("div", { children: [
							/* @__PURE__ */ D("div", { children: [
								"Progress ",
								/* @__PURE__ */ D("strong", { children: m }),
								" /",
								" ",
								/* @__PURE__ */ D("strong", { children: c }),
								" (remaining ",
								/* @__PURE__ */ D("strong", { children: S }),
								")"
							] }),
							/* @__PURE__ */ D("div", {
								style: "margin-top: 0.25rem;",
								children: ["Current: ", /* @__PURE__ */ D("code", { children: g })]
							}),
							/* @__PURE__ */ D("div", {
								style: "margin-top: 0.25rem; color: var(--ipe-modal-text-secondary);",
								children: w
							})
						] }),
						/* @__PURE__ */ D("div", {
							style: "display: flex; gap: 1rem; flex-wrap: wrap;",
							children: [/* @__PURE__ */ D("div", { children: [
								"Success:",
								" ",
								/* @__PURE__ */ D("strong", {
									style: "color: var(--ipe-modal-success);",
									children: v
								})
							] }), /* @__PURE__ */ D("div", { children: [
								"Failed:",
								" ",
								/* @__PURE__ */ D("strong", {
									style: "color: var(--ipe-modal-danger);",
									children: b
								})
							] })]
						}),
						/* @__PURE__ */ D("div", { children: [/* @__PURE__ */ D("div", {
							style: "color: var(--ipe-modal-text-secondary);",
							children: "Log (appended in time order):"
						}), E] })
					]
				}));
				let k = s.slice();
				for (C(k.length.toString()); k.length;) {
					let e = k[0];
					if (_(e), l.signal.aborted) break;
					try {
						await this.deleteOne(e, a, o), u.push(e), y(u.length.toString()), O("success", e);
					} catch (t) {
						d.push({
							title: e,
							error: t
						}), x(d.length.toString()), O("fail", e, t?.message || String(t));
					} finally {
						k.shift(), h((c - k.length).toString()), C(k.length.toString());
					}
					if (k.length) try {
						await V(1e3, l.signal);
					} catch {
						O("info", "Cancelled", "Delay interrupted; stopping subsequent deletions.");
						break;
					}
				}
				let A = k.slice(), j = Array.from(/* @__PURE__ */ new Set([...d.map((e) => e.title), ...A]));
				n.value = j.join("\n") + (j.length ? "\n" : ""), t.setLoadingState(!1), p.setTitle("Deletion Result"), p.removeButton("abort-delete-button"), f && T("Cancelled: subsequent deletions stopped (effective after the current request finishes)."), p.setContent(/* @__PURE__ */ D("div", {
					className: "theme-ipe-prose",
					style: {
						display: "grid",
						gap: "0.75rem"
					},
					children: [
						/* @__PURE__ */ D("div", {
							style: "display: flex; gap: 1rem; flex-wrap: wrap;",
							children: [
								/* @__PURE__ */ D("div", { children: [
									"Deleted:",
									" ",
									/* @__PURE__ */ D("strong", {
										style: "color: var(--ipe-modal-success);",
										children: u.length
									})
								] }),
								/* @__PURE__ */ D("div", { children: [
									"Failed:",
									" ",
									/* @__PURE__ */ D("strong", {
										style: "color: var(--ipe-modal-danger);",
										children: d.length
									})
								] }),
								/* @__PURE__ */ D("div", { children: [
									"Unprocessed:",
									" ",
									/* @__PURE__ */ D("strong", {
										style: "color: var(--ipe-modal-warning);",
										children: A.length
									})
								] })
							]
						}),
						(d.length || A.length) && /* @__PURE__ */ D("div", {
							style: "color: var(--ipe-modal-text-secondary);",
							children: [
								"Titles for ",
								/* @__PURE__ */ D("strong", { children: "failed + unprocessed" }),
								" items have been refilled into the input. Click Delete to retry."
							]
						}),
						d.length ? /* @__PURE__ */ D("div", { children: [/* @__PURE__ */ D("div", {
							style: "color: var(--ipe-modal-danger);",
							children: "Failure details:"
						}), /* @__PURE__ */ D("ul", {
							style: { margin: "0.25rem 0 0 1.25rem" },
							children: d.map(({ title: e, error: t }) => /* @__PURE__ */ D("li", { children: [/* @__PURE__ */ D("strong", { children: e }), /* @__PURE__ */ D("div", {
								style: "color: var(--ipe-modal-text-secondary);",
								children: t?.message || String(t)
							})] }, e))
						})] }) : null,
						A.length ? /* @__PURE__ */ D("div", { children: [/* @__PURE__ */ D("div", {
							style: "color: var(--ipe-modal-warning);",
							children: "Unprocessed (usually due to cancellation):"
						}), /* @__PURE__ */ D("ul", {
							style: { margin: "0.25rem 0 0 1.25rem" },
							children: A.map((e) => /* @__PURE__ */ D("li", { children: /* @__PURE__ */ D("strong", { children: e }) }, e))
						})] }) : null
					]
				})), p.setButtons([{
					label: "OK",
					className: "is-primary",
					method: () => {
						p.close();
					}
				}]);
			}
		}]), this.ctx.emit("quick-delete/show-modal", {
			ctx: this.ctx,
			modal: t,
			options: e
		}), this._modal = t, t.on(t.Event.Close, () => {
			this._modal = null;
		}), t;
	}
	async deleteOne(e, t, n) {
		let r = this.ctx.wikiPage.newBlankPage({ title: e }), i = await r.delete(t, { deletetalk: n });
		return this.ctx.emit("quick-delete/delete-one", {
			ctx: this.ctx,
			wikiPage: r,
			reason: t,
			deletetalk: n
		}), i;
	}
	async injectToolbox(e) {
		let t = this.ctx.currentPage.wikiTitle, n = this.ctx.wiki.hasRight("delete"), r = t && t.getNamespaceId() >= 0;
		e.toolbox.addButton({
			id: "quick-delete",
			group: "group2",
			icon: /* @__PURE__ */ D("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "24",
				height: "24",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "2",
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				class: "icon icon-tabler icons-tabler-outline icon-tabler-trash",
				children: [
					/* @__PURE__ */ D("path", {
						stroke: "none",
						d: "M0 0h24v24H0z",
						fill: "none"
					}),
					/* @__PURE__ */ D("path", { d: "M4 7l16 0" }),
					/* @__PURE__ */ D("path", { d: "M10 11l0 6" }),
					/* @__PURE__ */ D("path", { d: "M14 11l0 6" }),
					/* @__PURE__ */ D("path", { d: "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" }),
					/* @__PURE__ */ D("path", { d: "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" })
				]
			}),
			buttonProps: { disabled: !n },
			tooltip: n ? "Batch Delete" : "No permission",
			onClick: () => {
				this.showModal({ titles: t && r ? [t.getPrefixedText()] : [] });
			}
		});
	}
	removeToolbox(e) {
		e.toolbox.removeButton("quick-delete");
	}
};
//#endregion
export { H as PluginQuickDelete };

//# sourceMappingURL=index.mjs.map