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
//#region src/index.ts
var n = t({
	name: "code-mirror-v6",
	apply: (e) => {
		e.set("plugin:code-mirror-v6", e.scope);
		let t;
		e.inject(["plugin:wiki-editor"], (e) => {
			t = e.get("plugin:wiki-editor");
		});
		let n = typeof CodeMirror6 == "function" ? Promise.resolve(CodeMirror6) : (async () => (await import(
			/* @vite-ignore */
			"https://cdn.jsdelivr.net/npm/@bhsd/codemirror-mediawiki@4/dist/mw.min.js"
)).CodeMirror)();
		e.on("quick-edit/wiki-page", async ({ modal: e, wikiPage: { contentmodel: r, ns: i, title: a } }) => {
			(await n).fromTextArea(e.get$content().querySelector("textarea[name=\"text\"]"), r, {
				ns: i,
				page: a,
				extensions: t?.isActive ? ["wikiEditor"] : []
			});
		});
	}
});
//#endregion
export { n as default };

//# sourceMappingURL=index.mjs.map