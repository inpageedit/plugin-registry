const k = Object.keys;
function ce(e) {
  return typeof e == "boolean";
}
function ae(e) {
  return e && typeof e.nodeType == "number";
}
function j(e) {
  return typeof e == "string";
}
function X(e) {
  return typeof e == "number";
}
function f(e) {
  return typeof e == "object" ? e !== null : b(e);
}
function b(e) {
  return typeof e == "function";
}
function de(e) {
  return !!(e && e.isComponent);
}
function he(e) {
  return f(e) && typeof e.length == "number" && typeof e.nodeType != "number";
}
function L(e, t) {
  if (e)
    for (const n of k(e))
      t(e[n], n);
}
function ue(e) {
  return f(e) && "current" in e;
}
const R = {
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
function fe(e, t) {
  return e + t.charAt(0).toUpperCase() + t.substring(1);
}
const pe = ["Webkit", "ms", "Moz", "O"];
k(R).forEach((e) => {
  pe.forEach((t) => {
    R[fe(t, e)] = 0;
  });
});
const me = /* @__PURE__ */ Symbol.for("jsx-dom:type");
var _ = /* @__PURE__ */ (function(e) {
  return e.ShadowRoot = "ShadowRoot", e;
})(_ || {});
function ge(e) {
  return e != null && e[me] === _.ShadowRoot;
}
const xe = "http://www.w3.org/2000/svg", be = "http://www.w3.org/1999/xlink", we = "http://www.w3.org/XML/1998/namespace";
function K(e) {
  return !ce(e) && e != null;
}
function M(e) {
  return Array.isArray(e) ? e.map(M).filter(Boolean).join(" ") : f(e) ? Symbol.iterator in e ? M(Array.from(e)) : k(e).filter((t) => e[t]).join(" ") : K(e) ? "" + e : "";
}
const ye = {
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
}, Ce = /^(a(ll|t|u)|base[FP]|c(al|lipPathU|on)|di|ed|ex|filter[RU]|g(lyphR|r)|ke|l(en|im)|ma(rker[HUW]|s)|n|pat|pr|point[^e]|re[^n]|s[puy]|st[^or]|ta|textL|vi|xC|y|z)/;
function Te(e, t, n) {
  t = {
    ...t,
    children: n
  };
  const r = new e(t), i = r.render();
  return "ref" in t && q(t.ref, r), i;
}
function s(e, t) {
  let { children: n, ...r } = t;
  !r.namespaceURI && ye[e] === 0 && (r = {
    ...r,
    namespaceURI: xe
  });
  let i;
  if (j(e)) {
    if (i = r.namespaceURI ? document.createElementNS(r.namespaceURI, e) : document.createElement(e), ve(r, i), D(n, i), i instanceof window.HTMLSelectElement && r.value != null)
      if (r.multiple === !0 && Array.isArray(r.value)) {
        const l = r.value.map((c) => String(c));
        i.querySelectorAll("option").forEach(
          (c) => c.selected = l.includes(c.value)
        );
      } else
        i.value = r.value;
    q(r.ref, i);
  } else if (b(e))
    f(e.defaultProps) && (r = {
      ...e.defaultProps,
      ...r
    }), i = de(e) ? Te(e, r, n) : e({
      ...r,
      children: n
    });
  else
    throw new TypeError(`Invalid JSX element type: ${e}`);
  return i;
}
function q(e, t) {
  ue(e) ? e.current = t : b(e) && e(t);
}
function D(e, t) {
  if (he(e))
    ke(e, t);
  else if (j(e) || X(e))
    A(document.createTextNode(e), t);
  else if (e === null)
    A(document.createComment(""), t);
  else if (ae(e))
    A(e, t);
  else if (ge(e)) {
    const n = t.attachShadow(e.attr);
    D(e.children, n), q(e.ref, n);
  }
}
function ke(e, t) {
  for (const n of [...e])
    D(n, t);
  return t;
}
function A(e, t) {
  t instanceof window.HTMLTemplateElement ? t.content.appendChild(e) : t.appendChild(e);
}
function C(e, t) {
  return e.replace(/[A-Z]/g, (n) => t + n.toLowerCase());
}
function V(e, t) {
  t == null || t === !1 || (Array.isArray(t) ? t.forEach((n) => V(e, n)) : j(t) ? e.setAttribute("style", t) : f(t) && L(t, (n, r) => {
    r.indexOf("-") === 0 ? e.style.setProperty(r, n) : X(n) && R[r] !== 0 ? e.style[r] = n + "px" : e.style[r] = n;
  }));
}
function Se(e, t, n) {
  switch (e) {
    case "xlinkActuate":
    case "xlinkArcrole":
    case "xlinkHref":
    case "xlinkRole":
    case "xlinkShow":
    case "xlinkTitle":
    case "xlinkType":
      G(n, be, C(e, ":"), t);
      return;
    case "xmlnsXlink":
      m(n, C(e, ":"), t);
      return;
    case "xmlBase":
    case "xmlLang":
    case "xmlSpace":
      G(n, we, C(e, ":"), t);
      return;
  }
  switch (e) {
    case "htmlFor":
      m(n, "for", t);
      return;
    case "dataset":
      L(t, (r, i) => {
        r != null && (n.dataset[i] = r);
      });
      return;
    case "innerHTML":
    case "innerText":
    case "textContent":
      K(t) && (n[e] = t);
      return;
    case "dangerouslySetInnerHTML":
      f(t) && (n.innerHTML = t.__html);
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
      b(t) ? t(n) : m(n, "class", M(t));
      return;
    case "ref":
    case "namespaceURI":
      return;
    case "style":
      V(n, t);
      return;
    case "on":
    case "onCapture":
      L(t, (r, i) => {
        n.addEventListener(i, r, e === "onCapture");
      });
      return;
  }
  if (b(t)) {
    if (e[0] === "o" && e[1] === "n") {
      let r = e.toLowerCase();
      const i = r.endsWith("capture");
      if (r === "ondoubleclick" ? r = "ondblclick" : i && r === "ondoubleclickcapture" && (r = "ondblclickcapture"), !i && n[r] === null)
        n[r] = t;
      else if (i)
        n.addEventListener(
          r.substring(2, r.length - 7),
          t,
          !0
        );
      else {
        let l;
        r in window ? l = r.substring(2) : l = r[2] + e.slice(3), n.addEventListener(l, t);
      }
    }
  } else f(t) ? n[e] = t : t === !0 ? m(n, e, "") : t !== !1 && t != null && (n instanceof SVGElement && !Ce.test(e) ? m(n, C(e, "-"), t) : m(n, e, t));
}
function m(e, t, n) {
  e.setAttribute(t, n);
}
function G(e, t, n, r) {
  e.setAttributeNS(t, n, r);
}
function ve(e, t) {
  for (const n of k(e))
    Se(n, e[n], t);
  return t;
}
function g(e) {
  const t = new Text();
  Object.defineProperty(t, "toString", {
    value() {
      return this.textContent;
    }
  });
  function n(r) {
    t.textContent = r;
  }
  return e != null && n(e), [t, n];
}
const J = () => {
  let e, t;
  return { promise: new Promise((r, i) => {
    e = r, t = i;
  }), resolve: e, reject: t };
};
Promise.withResolvers || (Promise.withResolvers = J);
const T = class T {
  constructor(t, n = void 0, r) {
    this.ctx = t, this.name = r || "", this.config = n || {};
    const { promise: i, resolve: l, reject: c } = J();
    queueMicrotask(() => {
      this.name || (this.name = this.constructor.name);
      try {
        const a = this.start();
        a && typeof a.then == "function" ? a.then(() => l()).catch((w) => {
          this.logger.error("start() returns a rejected promise", w), c(w);
        }) : l();
      } catch (a) {
        this.logger.error("start() threw synchronously", a), c(a);
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
T.inject = [], T.reusable = !1;
let P = T;
const z = () => {
  const e = new Error("Aborted");
  return e.name = "AbortError", e;
}, Ee = (e) => new Promise((t) => setTimeout(t, e)), Ne = (e, t) => t ? t.aborted ? Promise.reject(z()) : new Promise((n, r) => {
  const i = setTimeout(() => {
    t.removeEventListener("abort", l), n();
  }, e), l = () => {
    clearTimeout(i), t.removeEventListener("abort", l), r(z());
  };
  t.addEventListener("abort", l, { once: !0 });
}) : Ee(e), F = class F extends P {
  constructor(t) {
    super(t, {}, "quick-delete"), this.ctx = t, this._modal = null, t.set("quickDelete", this);
  }
  start() {
    this.ctx.inject(["toolbox"], (n) => {
      this.injectToolbox(n), n.on("dispose", () => {
        this.removeToolbox(n);
      });
    }), this.ctx.inject(["analytics"], (n) => {
      n.on("quick-delete/delete-one", (r) => {
        n.analytics.addEvent(
          "quick-delete",
          "delete-one",
          r.wikiPage.title
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
    }), r = /* @__PURE__ */ s(
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
    ), i = /* @__PURE__ */ s(
      "form",
      {
        className: "ipe-quickDelete-modal",
        style: { display: "grid", gap: "1rem" },
        children: [
          /* @__PURE__ */ s("div", { className: "ipe-input-box", children: [
            /* @__PURE__ */ s("label", { htmlFor: "titles", children: "Enter the titles of the pages you want to delete, one per line." }),
            r
          ] }),
          /* @__PURE__ */ s("div", { className: "ipe-input-box", children: [
            /* @__PURE__ */ s("label", { htmlFor: "reason", children: "Reason" }),
            /* @__PURE__ */ s(
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
          /* @__PURE__ */ s("div", { className: "ipe-input-box", children: /* @__PURE__ */ s("label", { className: "ipe-checkbox", children: [
            /* @__PURE__ */ s("input", { type: "checkbox", id: "deletetalk", name: "deletetalk" }),
            /* @__PURE__ */ s("span", { className: "ipe-checkbox-box" }),
            /* @__PURE__ */ s("span", { children: "Delete talk pages, if exists" })
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
          const l = new FormData(i), c = l.get("titles"), a = l.get("reason"), w = l.get("deletetalk") === "on", S = Array.from(
            new Set(
              c.split(`
`).map((o) => o.trim()).filter(Boolean)
            )
          );
          r.value = S.join(`
`) + `
`;
          const y = S.length;
          if (y === 0)
            return;
          n.setLoadingState(!0);
          const v = new AbortController(), E = [], u = [];
          let I = !1;
          const p = this.ctx.modal.show({
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
                  I = !0, v.abort();
                }
              }
            ]
          }), [Z, $] = g("0"), [Q, Y] = g("-"), [ee, te] = g("0"), [ne, re] = g("0"), [se, O] = g(y.toString()), [ie, oe] = g(
            "Cancel will stop subsequent deletions (effective after the current request finishes)."
          ), B = /* @__PURE__ */ s("ul", { style: { margin: "0.25rem 0 0 1.25rem" } }), N = (o, d, U) => {
            const le = /* @__PURE__ */ s("li", { children: [
              /* @__PURE__ */ s("span", { style: { color: o === "success" ? "var(--ipe-modal-success)" : o === "fail" ? "var(--ipe-modal-danger)" : "var(--ipe-modal-text-secondary)" }, children: o === "success" ? "✔ " : o === "fail" ? "✖ " : "• " }),
              /* @__PURE__ */ s("strong", { children: d }),
              U ? /* @__PURE__ */ s("span", { children: [
                " — ",
                U
              ] }) : null
            ] });
            B.appendChild(le);
          };
          p.setContent(
            /* @__PURE__ */ s(
              "div",
              {
                className: "theme-ipe-prose",
                style: { display: "grid", gap: "0.75rem" },
                children: [
                  /* @__PURE__ */ s("div", { children: [
                    /* @__PURE__ */ s("div", { children: [
                      "Progress ",
                      /* @__PURE__ */ s("strong", { children: Z }),
                      " /",
                      " ",
                      /* @__PURE__ */ s("strong", { children: y }),
                      " (remaining ",
                      /* @__PURE__ */ s("strong", { children: se }),
                      ")"
                    ] }),
                    /* @__PURE__ */ s("div", { style: "margin-top: 0.25rem;", children: [
                      "Current: ",
                      /* @__PURE__ */ s("code", { children: Q })
                    ] }),
                    /* @__PURE__ */ s("div", { style: "margin-top: 0.25rem; color: var(--ipe-modal-text-secondary);", children: ie })
                  ] }),
                  /* @__PURE__ */ s("div", { style: "display: flex; gap: 1rem; flex-wrap: wrap;", children: [
                    /* @__PURE__ */ s("div", { children: [
                      "Success:",
                      " ",
                      /* @__PURE__ */ s("strong", { style: "color: var(--ipe-modal-success);", children: ee })
                    ] }),
                    /* @__PURE__ */ s("div", { children: [
                      "Failed:",
                      " ",
                      /* @__PURE__ */ s("strong", { style: "color: var(--ipe-modal-danger);", children: ne })
                    ] })
                  ] }),
                  /* @__PURE__ */ s("div", { children: [
                    /* @__PURE__ */ s("div", { style: "color: var(--ipe-modal-text-secondary);", children: "Log (appended in time order):" }),
                    B
                  ] })
                ]
              }
            )
          );
          const h = S.slice();
          for (O(h.length.toString()); h.length; ) {
            const o = h[0];
            if (Y(o), v.signal.aborted)
              break;
            try {
              await this.deleteOne(o, a, w), E.push(o), te(E.length.toString()), N("success", o);
            } catch (d) {
              u.push({ title: o, error: d }), re(u.length.toString()), N("fail", o, d?.message || String(d));
            } finally {
              h.shift(), $((y - h.length).toString()), O(h.length.toString());
            }
            if (h.length)
              try {
                await Ne(1e3, v.signal);
              } catch {
                N("info", "Cancelled", "Delay interrupted; stopping subsequent deletions.");
                break;
              }
          }
          const x = h.slice(), H = Array.from(
            /* @__PURE__ */ new Set([...u.map((o) => o.title), ...x])
          );
          r.value = H.join(`
`) + (H.length ? `
` : ""), n.setLoadingState(!1), p.setTitle("Deletion Result"), p.removeButton("abort-delete-button"), I && oe(
            "Cancelled: subsequent deletions stopped (effective after the current request finishes)."
          ), p.setContent(
            /* @__PURE__ */ s(
              "div",
              {
                className: "theme-ipe-prose",
                style: { display: "grid", gap: "0.75rem" },
                children: [
                  /* @__PURE__ */ s("div", { style: "display: flex; gap: 1rem; flex-wrap: wrap;", children: [
                    /* @__PURE__ */ s("div", { children: [
                      "Deleted:",
                      " ",
                      /* @__PURE__ */ s("strong", { style: "color: var(--ipe-modal-success);", children: E.length })
                    ] }),
                    /* @__PURE__ */ s("div", { children: [
                      "Failed:",
                      " ",
                      /* @__PURE__ */ s("strong", { style: "color: var(--ipe-modal-danger);", children: u.length })
                    ] }),
                    /* @__PURE__ */ s("div", { children: [
                      "Unprocessed:",
                      " ",
                      /* @__PURE__ */ s("strong", { style: "color: var(--ipe-modal-warning);", children: x.length })
                    ] })
                  ] }),
                  (u.length || x.length) && /* @__PURE__ */ s("div", { style: "color: var(--ipe-modal-text-secondary);", children: [
                    "Titles for ",
                    /* @__PURE__ */ s("strong", { children: "failed + unprocessed" }),
                    " items have been refilled into the input. Click Delete to retry."
                  ] }),
                  u.length ? /* @__PURE__ */ s("div", { children: [
                    /* @__PURE__ */ s("div", { style: "color: var(--ipe-modal-danger);", children: "Failure details:" }),
                    /* @__PURE__ */ s("ul", { style: { margin: "0.25rem 0 0 1.25rem" }, children: u.map(({ title: o, error: d }) => /* @__PURE__ */ s("li", { children: [
                      /* @__PURE__ */ s("strong", { children: o }),
                      /* @__PURE__ */ s("div", { style: "color: var(--ipe-modal-text-secondary);", children: d?.message || String(d) })
                    ] }, o)) })
                  ] }) : null,
                  x.length ? /* @__PURE__ */ s("div", { children: [
                    /* @__PURE__ */ s("div", { style: "color: var(--ipe-modal-warning);", children: "Unprocessed (usually due to cancellation):" }),
                    /* @__PURE__ */ s("ul", { style: { margin: "0.25rem 0 0 1.25rem" }, children: x.map((o) => /* @__PURE__ */ s("li", { children: /* @__PURE__ */ s("strong", { children: o }) }, o)) })
                  ] }) : null
                ]
              }
            )
          ), p.setButtons([
            {
              label: "OK",
              className: "is-primary",
              method: () => {
                p.close();
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
  async deleteOne(t, n, r) {
    const i = this.ctx.wikiPage.newBlankPage({ title: t }), l = await i.delete(n, { deletetalk: r });
    return this.ctx.emit("quick-delete/delete-one", {
      ctx: this.ctx,
      wikiPage: i,
      reason: n,
      deletetalk: r
    }), l;
  }
  async injectToolbox(t) {
    const n = this.ctx.currentPage.wikiTitle, r = this.ctx.wiki.hasRight("delete"), i = n && n.getNamespaceId() >= 0;
    t.toolbox.addButton({
      id: "quick-delete",
      group: "group2",
      icon: /* @__PURE__ */ s(
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
            /* @__PURE__ */ s("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
            /* @__PURE__ */ s("path", { d: "M4 7l16 0" }),
            /* @__PURE__ */ s("path", { d: "M10 11l0 6" }),
            /* @__PURE__ */ s("path", { d: "M14 11l0 6" }),
            /* @__PURE__ */ s("path", { d: "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" }),
            /* @__PURE__ */ s("path", { d: "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" })
          ]
        }
      ),
      buttonProps: {
        disabled: !r
      },
      tooltip: r ? "Batch Delete" : "No permission",
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
F.using = [
  "api",
  "currentPage",
  "wiki",
  "wikiPage",
  "modal",
  "preferences"
];
let W = F;
export {
  W as PluginQuickDelete
};
//# sourceMappingURL=index.mjs.map
