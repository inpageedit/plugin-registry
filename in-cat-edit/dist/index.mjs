const C = Object.keys;
function H(e) {
  return typeof e == "boolean";
}
function G(e) {
  return e && typeof e.nodeType == "number";
}
function L(e) {
  return typeof e == "string";
}
function j(e) {
  return typeof e == "number";
}
function u(e) {
  return typeof e == "object" ? e !== null : w(e);
}
function w(e) {
  return typeof e == "function";
}
function B(e) {
  return !!(e && e.isComponent);
}
function D(e) {
  return u(e) && typeof e.length == "number" && typeof e.nodeType != "number";
}
function S(e, t) {
  if (e)
    for (const n of C(e))
      t(e[n], n);
}
function W(e) {
  return u(e) && "current" in e;
}
const E = {
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
function z(e, t) {
  return e + t.charAt(0).toUpperCase() + t.substring(1);
}
const X = ["Webkit", "ms", "Moz", "O"];
C(E).forEach((e) => {
  X.forEach((t) => {
    E[z(t, e)] = 0;
  });
});
const $ = /* @__PURE__ */ Symbol.for("jsx-dom:type");
var q = /* @__PURE__ */ (function(e) {
  return e.ShadowRoot = "ShadowRoot", e;
})(q || {});
function V(e) {
  return e != null && e[$] === q.ShadowRoot;
}
const _ = "http://www.w3.org/2000/svg", J = "http://www.w3.org/1999/xlink", K = "http://www.w3.org/XML/1998/namespace";
function I(e) {
  return !H(e) && e != null;
}
function P(e) {
  return Array.isArray(e) ? e.map(P).filter(Boolean).join(" ") : u(e) ? Symbol.iterator in e ? P(Array.from(e)) : C(e).filter((t) => e[t]).join(" ") : I(e) ? "" + e : "";
}
const Z = {
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
}, Q = /^(a(ll|t|u)|base[FP]|c(al|lipPathU|on)|di|ed|ex|filter[RU]|g(lyphR|r)|ke|l(en|im)|ma(rker[HUW]|s)|n|pat|pr|point[^e]|re[^n]|s[puy]|st[^or]|ta|textL|vi|xC|y|z)/;
function Y(e, t, n) {
  t = {
    ...t,
    children: n
  };
  const r = new e(t), i = r.render();
  return "ref" in t && T(t.ref, r), i;
}
function l(e, t) {
  let { children: n, ...r } = t;
  !r.namespaceURI && Z[e] === 0 && (r = {
    ...r,
    namespaceURI: _
  });
  let i;
  if (L(e)) {
    if (i = r.namespaceURI ? document.createElementNS(r.namespaceURI, e) : document.createElement(e), te(r, i), A(n, i), i instanceof window.HTMLSelectElement && r.value != null)
      if (r.multiple === !0 && Array.isArray(r.value)) {
        const s = r.value.map((o) => String(o));
        i.querySelectorAll("option").forEach(
          (o) => o.selected = s.includes(o.value)
        );
      } else
        i.value = r.value;
    T(r.ref, i);
  } else if (w(e))
    u(e.defaultProps) && (r = {
      ...e.defaultProps,
      ...r
    }), i = B(e) ? Y(e, r, n) : e({
      ...r,
      children: n
    });
  else
    throw new TypeError(`Invalid JSX element type: ${e}`);
  return i;
}
function T(e, t) {
  W(e) ? e.current = t : w(e) && e(t);
}
function A(e, t) {
  if (D(e))
    v(e, t);
  else if (L(e) || j(e))
    k(document.createTextNode(e), t);
  else if (e === null)
    k(document.createComment(""), t);
  else if (G(e))
    k(e, t);
  else if (V(e)) {
    const n = t.attachShadow(e.attr);
    A(e.children, n), T(e.ref, n);
  }
}
function v(e, t) {
  for (const n of [...e])
    A(n, t);
  return t;
}
function k(e, t) {
  t instanceof window.HTMLTemplateElement ? t.content.appendChild(e) : t.appendChild(e);
}
function b(e, t) {
  return e.replace(/[A-Z]/g, (n) => t + n.toLowerCase());
}
function O(e, t) {
  t == null || t === !1 || (Array.isArray(t) ? t.forEach((n) => O(e, n)) : L(t) ? e.setAttribute("style", t) : u(t) && S(t, (n, r) => {
    r.indexOf("-") === 0 ? e.style.setProperty(r, n) : j(n) && E[r] !== 0 ? e.style[r] = n + "px" : e.style[r] = n;
  }));
}
function ee(e, t, n) {
  switch (e) {
    case "xlinkActuate":
    case "xlinkArcrole":
    case "xlinkHref":
    case "xlinkRole":
    case "xlinkShow":
    case "xlinkTitle":
    case "xlinkType":
      N(n, J, b(e, ":"), t);
      return;
    case "xmlnsXlink":
      h(n, b(e, ":"), t);
      return;
    case "xmlBase":
    case "xmlLang":
    case "xmlSpace":
      N(n, K, b(e, ":"), t);
      return;
  }
  switch (e) {
    case "htmlFor":
      h(n, "for", t);
      return;
    case "dataset":
      S(t, (r, i) => {
        r != null && (n.dataset[i] = r);
      });
      return;
    case "innerHTML":
    case "innerText":
    case "textContent":
      I(t) && (n[e] = t);
      return;
    case "dangerouslySetInnerHTML":
      u(t) && (n.innerHTML = t.__html);
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
      w(t) ? t(n) : h(n, "class", P(t));
      return;
    case "ref":
    case "namespaceURI":
      return;
    case "style":
      O(n, t);
      return;
    case "on":
    case "onCapture":
      S(t, (r, i) => {
        n.addEventListener(i, r, e === "onCapture");
      });
      return;
  }
  if (w(t)) {
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
        let s;
        r in window ? s = r.substring(2) : s = r[2] + e.slice(3), n.addEventListener(s, t);
      }
    }
  } else u(t) ? n[e] = t : t === !0 ? h(n, e, "") : t !== !1 && t != null && (n instanceof SVGElement && !Q.test(e) ? h(n, b(e, "-"), t) : h(n, e, t));
}
function h(e, t, n) {
  e.setAttribute(t, n);
}
function N(e, t, n, r) {
  e.setAttributeNS(t, n, r);
}
function te(e, t) {
  for (const n of C(e))
    ee(n, e[n], t);
  return t;
}
const ne = () => {
  let e, t;
  return { promise: new Promise((r, i) => {
    e = r, t = i;
  }), resolve: e, reject: t };
};
Promise.withResolvers || (Promise.withResolvers = ne);
const re = (e) => e, F = ({
  isRedLink: e,
  onClick: t
}) => /* @__PURE__ */ l(
  "a",
  {
    href: "#ipe://quick-edit/",
    class: `ipe-quick-edit ${e ? "ipe-quick-edit--create-only" : ""}`,
    style: "user-select: none; margin-left: 0.2em;",
    onClick: t,
    children: /* @__PURE__ */ l(
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
        class: "icon icon-tabler icons-tabler-outline icon-tabler-pencil-bolt ipe-icon",
        children: [
          /* @__PURE__ */ l("path", { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }),
          /* @__PURE__ */ l("path", { d: "M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" }),
          /* @__PURE__ */ l("path", { d: "M13.5 6.5l4 4" }),
          /* @__PURE__ */ l("path", { d: "M19 16l-2 3h4l-2 3" })
        ]
      }
    )
  }
), ie = ({
  counterpartTitle: e,
  isMissing: t,
  onCounterpartEditClick: n
}) => {
  const i = e.equals(e.getSubjectPage()) ? "Main" : "Talk", s = e.getPrefixedText();
  let o = e.getURL().toString();
  if (t) {
    const c = new URL(o, window.location.origin);
    c.searchParams.set("action", "edit"), c.searchParams.set("redlink", "1"), o = c.pathname + c.search;
  }
  return /* @__PURE__ */ l("span", { class: "ipe-in-cat-edit-counterpart", children: [
    " (",
    /* @__PURE__ */ l("a", { href: o, title: s, class: t ? "new" : "", children: i }),
    /* @__PURE__ */ l(F, { isRedLink: t, onClick: n }),
    ")"
  ] });
}, ce = re({
  name: "in-cat-edit",
  inject: ["quickEdit", "inArticleLinks", "api", "wiki"],
  apply: (e) => {
    e.wiki.mwConfig.get("wgNamespaceNumber") === 14 && mw.hook("wikipage.content").add(async (n) => {
      const r = n[0];
      if (!r) return;
      const s = Array.from(
        r.querySelectorAll(
          ".mw-category, #mw-subcategories, #mw-pages, #mw-category-media"
        )
      ).filter((a, p, m) => !m.some((f) => f !== a && f.contains(a)));
      if (!s.length) return;
      const o = [];
      s.forEach((a) => {
        o.push(...e.inArticleLinks.scanAnchors(a));
      });
      const c = [], y = [];
      for (const { $el: a, title: p } of o) {
        if (!p) continue;
        const m = p.getPrefixedText(), f = se(p), g = { $el: a, titlePrefixed: m };
        if (f) {
          const d = f.getPrefixedText();
          g.counterpart = {
            title: f,
            prefixed: d
          }, y.push(d);
        }
        c.push(g);
      }
      const x = await oe(y, e.api);
      for (const { $el: a, titlePrefixed: p, counterpart: m } of c) {
        if (a.dataset.ipeInCatEditProcessed) continue;
        a.dataset.ipeInCatEditProcessed = "1";
        const f = document.createDocumentFragment();
        if (f.appendChild(
          /* @__PURE__ */ l(
            F,
            {
              isRedLink: !1,
              onClick: (d) => {
                d.preventDefault(), e.quickEdit.showModal({
                  title: p,
                  createOnly: !1
                });
              }
            }
          )
        ), m) {
          const { title: d, prefixed: R } = m, M = x.has(R);
          f.appendChild(
            /* @__PURE__ */ l(
              ie,
              {
                counterpartTitle: d,
                isMissing: M,
                onCounterpartEditClick: (U) => {
                  U.preventDefault(), e.quickEdit.showModal({
                    title: R,
                    createOnly: M
                  });
                }
              }
            )
          );
        }
        const g = a.parentNode;
        g && g.insertBefore(f, a.nextSibling);
      }
    });
  }
}), se = (e) => {
  const t = e.getSubjectPage();
  return e.equals(t) ? e.getTalkPage() : t;
}, oe = async (e, t, n = 50) => {
  const r = /* @__PURE__ */ new Set(), i = [];
  for (let s = 0; s < e.length; s += n) {
    const o = e.slice(s, s + n);
    i.push(
      t.post({
        action: "query",
        titles: o.join("|"),
        format: "json",
        formatversion: 2
      }).then((c) => {
        (c.data?.query || c.query)?.pages?.forEach((x) => {
          x.missing && r.add(x.title);
        });
      }).catch((c) => {
        console.error("[in-cat-edit] Failed to check page existence", c);
      })
    );
  }
  return await Promise.all(i), r;
};
export {
  ce as default
};
//# sourceMappingURL=index.mjs.map
