const promiseWithResolvers = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};
if (!Promise.withResolvers) {
  Promise.withResolvers = promiseWithResolvers;
}

const defineIPEPlugin = (plugin) => {
  return plugin;
};

const index = defineIPEPlugin({
  name: "code-mirror-v6",
  apply: (ctx) => {
    ctx.set("plugin:code-mirror-v6", ctx.scope);
    let pluginWikiEditor;
    ctx.inject(["plugin:wiki-editor"], (ctx2) => {
      pluginWikiEditor = ctx2.get("plugin:wiki-editor");
    });
    const CodeMirrorPromise = typeof CodeMirror6 === "function" ? Promise.resolve(CodeMirror6) : (async () => {
      const pkg = await import(
        // @ts-ignore
        /* @vite-ignore */
        'https://cdn.jsdelivr.net/npm/@bhsd/codemirror-mediawiki/dist/mw.min.js'
      );
      return pkg.CodeMirror;
    })();
    ctx.on(
      "quick-edit/wiki-page",
      async ({ modal, wikiPage: { contentmodel, ns, title } }) => {
        const CodeMirror = await CodeMirrorPromise;
        CodeMirror.fromTextArea(
          modal.get$content().querySelector('textarea[name="text"]'),
          contentmodel,
          ns,
          title,
          pluginWikiEditor?.isActive ? ["wikiEditor"] : []
        );
      }
    );
  }
});

export { index as default };
