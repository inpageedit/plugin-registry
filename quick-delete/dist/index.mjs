const b = Object.keys;
function G(e) {
  return typeof e == "boolean";
}
function U(e) {
  return e && typeof e.nodeType == "number";
}
function R(e) {
  return typeof e == "string";
}
function I(e) {
  return typeof e == "number";
}
function h(e) {
  return typeof e == "object" ? e !== null : m(e);
}
function m(e) {
  return typeof e == "function";
}
function z(e) {
  return !!(e && e.isComponent);
}
function W(e) {
  return h(e) && typeof e.length == "number" && typeof e.nodeType != "number";
}
function S(e, t) {
  if (e)
    for (const n of b(e))
      t(e[n], n);
}
function X(e) {
  return h(e) && "current" in e;
}
const T = {
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
  // SVG-related properties
  fillOpacity: 0,
  floodOpacity: 0,
  stopOpacity: 0,
  strokeDasharray: 0,
  strokeDashoffset: 0,
  strokeMiterlimit: 0,
  strokeOpacity: 0,
  strokeWidth: 0
};
function _(e, t) {
  return e + t.charAt(0).toUpperCase() + t.substring(1);
}
const V = ["Webkit", "ms", "Moz", "O"];
b(T).forEach((e) => {
  V.forEach((t) => {
    T[_(t, e)] = 0;
  });
});
const K = Symbol.for("jsx-dom:type");
var O = /* @__PURE__ */ (function(e) {
  return e.ShadowRoot = "ShadowRoot", e;
})(O || {});
function J(e) {
  return e != null && e[K] === O.ShadowRoot;
}
const Z = "http://www.w3.org/2000/svg", $ = "http://www.w3.org/1999/xlink", Q = "http://www.w3.org/XML/1998/namespace";
function q(e) {
  return !G(e) && e != null;
}
function N(e) {
  return Array.isArray(e) ? e.map(N).filter(Boolean).join(" ") : h(e) ? Symbol.iterator in e ? N(Array.from(e)) : b(e).filter((t) => e[t]).join(" ") : q(e) ? "" + e : "";
}
const Y = {
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
}, ee = /^(a(ll|t|u)|base[FP]|c(al|lipPathU|on)|di|ed|ex|filter[RU]|g(lyphR|r)|ke|l(en|im)|ma(rker[HUW]|s)|n|pat|pr|point[^e]|re[^n]|s[puy]|st[^or]|ta|textL|vi|xC|y|z)/;
function te(e, t, n) {
  t = {
    ...t,
    children: n
  };
  const s = new e(t), i = s.render();
  return "ref" in t && M(t.ref, s), i;
}
function r(e, t) {
  let { children: n, ...s } = t;
  !s.namespaceURI && Y[e] === 0 && (s = {
    ...s,
    namespaceURI: Z
  });
  let i;
  if (R(e)) {
    if (i = s.namespaceURI ? document.createElementNS(s.namespaceURI, e) : document.createElement(e), ie(s, i), L(n, i), i instanceof window.HTMLSelectElement && s.value != null)
      if (s.multiple === !0 && Array.isArray(s.value)) {
        const o = s.value.map((l) => String(l));
        i.querySelectorAll("option").forEach(
          (l) => l.selected = o.includes(l.value)
        );
      } else
        i.value = s.value;
    M(s.ref, i);
  } else if (m(e))
    h(e.defaultProps) && (s = {
      ...e.defaultProps,
      ...s
    }), i = z(e) ? te(e, s, n) : e({
      ...s,
      children: n
    });
  else
    throw new TypeError(`Invalid JSX element type: ${e}`);
  return i;
}
function M(e, t) {
  X(e) ? e.current = t : m(e) && e(t);
}
function L(e, t) {
  if (W(e))
    ne(e, t);
  else if (R(e) || I(e))
    C(document.createTextNode(e), t);
  else if (e === null)
    C(document.createComment(""), t);
  else if (U(e))
    C(e, t);
  else if (J(e)) {
    const n = t.attachShadow(e.attr);
    L(e.children, n), M(e.ref, n);
  }
}
function ne(e, t) {
  for (const n of [...e])
    L(n, t);
  return t;
}
function C(e, t) {
  t instanceof window.HTMLTemplateElement ? t.content.appendChild(e) : t.appendChild(e);
}
function x(e, t) {
  return e.replace(/[A-Z]/g, (n) => t + n.toLowerCase());
}
function F(e, t) {
  t == null || t === !1 || (Array.isArray(t) ? t.forEach((n) => F(e, n)) : R(t) ? e.setAttribute("style", t) : h(t) && S(t, (n, s) => {
    s.indexOf("-") === 0 ? e.style.setProperty(s, n) : I(n) && T[s] !== 0 ? e.style[s] = n + "px" : e.style[s] = n;
  }));
}
function se(e, t, n) {
  switch (e) {
    case "xlinkActuate":
    case "xlinkArcrole":
    case "xlinkHref":
    case "xlinkRole":
    case "xlinkShow":
    case "xlinkTitle":
    case "xlinkType":
      D(n, $, x(e, ":"), t);
      return;
    case "xmlnsXlink":
      d(n, x(e, ":"), t);
      return;
    case "xmlBase":
    case "xmlLang":
    case "xmlSpace":
      D(n, Q, x(e, ":"), t);
      return;
  }
  switch (e) {
    case "htmlFor":
      d(n, "for", t);
      return;
    case "dataset":
      S(t, (s, i) => {
        s != null && (n.dataset[i] = s);
      });
      return;
    case "innerHTML":
    case "innerText":
    case "textContent":
      q(t) && (n[e] = t);
      return;
    case "dangerouslySetInnerHTML":
      h(t) && (n.innerHTML = t.__html);
      return;
    case "value":
      if (t == null || n instanceof window.HTMLSelectElement)
        return;
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
      m(t) ? t(n) : d(n, "class", N(t));
      return;
    case "ref":
    case "namespaceURI":
      return;
    case "style":
      F(n, t);
      return;
    case "on":
    case "onCapture":
      S(t, (s, i) => {
        n.addEventListener(i, s, e === "onCapture");
      });
      return;
  }
  if (m(t)) {
    if (e[0] === "o" && e[1] === "n") {
      let s = e.toLowerCase();
      const i = s.endsWith("capture");
      if (s === "ondoubleclick" ? s = "ondblclick" : i && s === "ondoubleclickcapture" && (s = "ondblclickcapture"), !i && n[s] === null)
        n[s] = t;
      else if (i)
        n.addEventListener(
          s.substring(2, s.length - 7),
          t,
          !0
        );
      else {
        let o;
        s in window ? o = s.substring(2) : o = s[2] + e.slice(3), n.addEventListener(o, t);
      }
    }
  } else h(t) ? n[e] = t : t === !0 ? d(n, e, "") : t !== !1 && t != null && (n instanceof SVGElement && !ee.test(e) ? d(n, x(e, "-"), t) : d(n, e, t));
}
function d(e, t, n) {
  e.setAttribute(t, n);
}
function D(e, t, n, s) {
  e.setAttributeNS(t, n, s);
}
function ie(e, t) {
  for (const n of b(e))
    se(n, e[n], t);
  return t;
}
function re(e) {
  const t = new Text();
  Object.defineProperty(t, "toString", {
    value() {
      return this.textContent;
    }
  });
  function n(s) {
    t.textContent = s;
  }
  return n(e), [t, n];
}
const B = () => {
  let e, t;
  return { promise: new Promise((s, i) => {
    e = s, t = i;
  }), resolve: e, reject: t };
};
Promise.withResolvers || (Promise.withResolvers = B);
const w = class w {
  constructor(t, n = void 0, s) {
    this.ctx = t, this.name = s || "", this.config = n || {};
    const { promise: i, resolve: o, reject: l } = B();
    queueMicrotask(() => {
      this.name || (this.name = this.constructor.name);
      try {
        const a = this.start();
        a && typeof a.then == "function" ? a.then(() => o()).catch((g) => {
          this.logger.error("start() returns a rejected promise", g), l(g);
        }) : o();
      } catch (a) {
        this.logger.error("start() threw synchronously", a), l(a);
      }
      i.then(() => {
        this.logger.debug("started");
      }), i.catch((a) => {
        this.logger.error("start failed", a), this.ctx.scope.dispose();
      });
    }), this.ctx.once("dispose", () => {
      this.stop(), this.logger.debug("disposed");
    });
  }
  start() {
  }
  stop() {
  }
  get logger() {
    return this.ctx.logger(this.name);
  }
  get Schema() {
    return this.ctx.schema;
  }
};
w.inject = [], w.reusable = !1;
let E = w;
const oe = (e) => new Promise((t) => setTimeout(t, e)), A = class A extends E {
  constructor(t) {
    super(t, {}, "quick-delete"), this.ctx = t, this._modal = null, t.set("quickDelete", this);
  }
  start() {
    this.ctx.inject(["toolbox"], (n) => {
      this.injectToolbox(n), n.on("dispose", () => {
        this.removeToolbox(n);
      });
    }), this.ctx.inject(["analytics"], (n) => {
      n.on("quick-delete/delete-one", (s) => {
        n.analytics.addEvent(
          "quick-delete",
          "delete-one",
          s.wikiPage.title
        );
      });
    });
    const t = this.ctx.schema;
    this.ctx.preferences.registerCustomConfig(
      "quick-delete",
      t.object({
        "quickDelete.reason": t.string().description("Default delete reason for quick delete").default("[IPE-NEXT] Quick delete")
      }).description("Quick delete options").extra("category", "editor"),
      "editor"
    );
  }
  stop() {
    this._modal && this._modal.close();
  }
  async showModal(t) {
    this._modal && this._modal.close(), t = {
      titles: [],
      deleteReason: await this.ctx.preferences.get("quickDelete.reason") || "",
      reloadAfterDelete: !0,
      ...t
    }, this.ctx.emit("quick-delete/init-options", {
      ctx: this.ctx,
      options: t
    });
    const n = this.ctx.modal.show({
      title: "Batch Delete",
      sizeClass: "dialog"
    }), s = /* @__PURE__ */ r(
      "textarea",
      {
        name: "titles",
        id: "titles",
        rows: 10,
        placeholder: "Enter the titles of the pages you want to delete, one per line.",
        children: [
          t.titles.join(`
`),
          `
`
        ]
      }
    ), i = /* @__PURE__ */ r(
      "form",
      {
        className: "ipe-quickDelete-modal",
        style: { display: "grid", gap: "1rem" },
        children: [
          /* @__PURE__ */ r("div", { className: "ipe-input-box", children: [
            /* @__PURE__ */ r("label", { htmlFor: "titles", children: "Enter the titles of the pages you want to delete, one per line." }),
            s
          ] }),
          /* @__PURE__ */ r("div", { className: "ipe-input-box", children: [
            /* @__PURE__ */ r("label", { htmlFor: "reason", children: "Reason" }),
            /* @__PURE__ */ r(
              "input",
              {
                type: "text",
                name: "reason",
                id: "reason",
                value: t.deleteReason,
                placeholder: "Enter the reason for deletion."
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "ipe-input-box", children: /* @__PURE__ */ r("label", { className: "ipe-checkbox", children: [
            /* @__PURE__ */ r("input", { type: "checkbox", id: "deletetalk", name: "deletetalk" }),
            /* @__PURE__ */ r("span", { className: "ipe-checkbox-box" }),
            /* @__PURE__ */ r("span", { children: "Delete talk pages, if exists" })
          ] }) })
        ]
      }
    );
    return n.setContent(i), n.setButtons([
      {
        label: "Cancel",
        method: () => {
          n.close();
        }
      },
      {
        label: "Delete",
        className: "is-danger",
        method: async () => {
          const o = new FormData(i), l = o.get("titles"), a = o.get("reason"), g = o.get("deletetalk") === "on", c = Array.from(
            new Set(
              l.split(`
`).map((f) => f.trim()).filter(Boolean)
            )
          );
          s.value = c.join(`
`) + `
`;
          const y = c.length;
          if (y === 0)
            return;
          n.setLoadingState(!0);
          const j = new AbortController(), p = [], u = this.ctx.modal.show({
            title: "Deleting...",
            closeIcon: !1,
            outSideClose: !1,
            sizeClass: "dialog",
            buttons: [
              {
                id: "abort-delete-button",
                label: "Cancel",
                className: "is-danger is-text",
                method: () => {
                  j.abort();
                }
              }
            ]
          }), [H, v] = re("0");
          u.setContent(
            /* @__PURE__ */ r(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "4rem"
                },
                children: /* @__PURE__ */ r("span", { children: [
                  "Deleting ",
                  H,
                  " of ",
                  c.length,
                  " pages..."
                ] })
              }
            )
          );
          for (const f of c) {
            if (j.signal.aborted)
              break;
            try {
              await this.deleteOne(f, a, g);
            } catch (k) {
              p.push({ title: f, error: k });
            }
            c.shift(), v((y - c.length).toString()), c.length && await oe(1e3);
          }
          n.setLoadingState(!1), s.value = c.join(`
`) + `
`, u.setTitle("Deletion Result"), u.removeButton("abort-delete-button"), u.setContent(
            /* @__PURE__ */ r("div", { className: "theme-ipe-prose", children: [
              /* @__PURE__ */ r("p", { style: "color: var(--ipe-modal-success);", children: [
                "Deleted ",
                y - p.length,
                " pages."
              ] }),
              c.length && /* @__PURE__ */ r("p", { style: "color: var(--ipe-modal-warning);", children: [
                "Skipped ",
                c.length,
                " pages."
              ] }),
              p.length && /* @__PURE__ */ r("div", { children: [
                /* @__PURE__ */ r("p", { style: "color: var(--ipe-modal-danger);", children: [
                  "Failed to delete ",
                  p.length,
                  " pages:"
                ] }),
                /* @__PURE__ */ r("ul", { children: p.map(({ title: f, error: k }) => /* @__PURE__ */ r("li", { children: [
                  /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r("strong", { children: f }) }),
                  /* @__PURE__ */ r("div", { children: k.message })
                ] }, f)) })
              ] })
            ] })
          ), u.setButtons([
            {
              label: "OK",
              className: "is-primary",
              method: () => {
                u.close();
              }
            }
          ]);
        }
      }
    ]), this.ctx.emit("quick-delete/show-modal", {
      ctx: this.ctx,
      modal: n,
      options: t
    }), this._modal = n, n.on(n.Event.Close, () => {
      this._modal = null;
    }), n;
  }
  async deleteOne(t, n, s) {
    const i = this.ctx.wikiPage.newBlankPage({ title: t }), o = await i.delete(n, { deletetalk: s });
    return this.ctx.emit("quick-delete/delete-one", {
      ctx: this.ctx,
      wikiPage: i,
      reason: n,
      deletetalk: s
    }), o;
  }
  async injectToolbox(t) {
    const n = this.ctx.currentPage.wikiTitle, s = this.ctx.wiki.hasRight("delete"), i = n && n.getNamespaceId() >= 0;
    t.toolbox.addButton({
      id: "quick-delete",
      group: "group2",
      icon: /* @__PURE__ */ r(
        "svg",
        {
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
            /* @__PURE__ */ r("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
            /* @__PURE__ */ r("path", { d: "M4 7l16 0" }),
            /* @__PURE__ */ r("path", { d: "M10 11l0 6" }),
            /* @__PURE__ */ r("path", { d: "M14 11l0 6" }),
            /* @__PURE__ */ r("path", { d: "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" }),
            /* @__PURE__ */ r("path", { d: "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" })
          ]
        }
      ),
      buttonProps: {
        disabled: !s
      },
      tooltip: s ? "Batch Delete" : "No permission",
      onClick: () => {
        this.showModal({
          titles: n && i ? [n.getPrefixedText()] : []
        });
      }
    });
  }
  removeToolbox(t) {
    t.toolbox.removeButton("quick-delete");
  }
};
A.using = [
  "api",
  "currentPage",
  "wiki",
  "wikiPage",
  "modal",
  "preferences"
];
let P = A;
export {
  P as PluginQuickDelete
};
//# sourceMappingURL=index.mjs.map
