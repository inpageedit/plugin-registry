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
    const preferWikiEditor = [];
    ctx.inject(["plugin:wiki-editor"], (ctx2) => {
      preferWikiEditor.push("wikiEditor");
      ctx2.get("plugin:wiki-editor")?.dispose();
    });
    ctx.on(
      "quick-edit/wiki-page",
      async ({ modal, wikiPage: { contentmodel, ns, title } }) => {
        const pkg = await import(
          // @ts-ignore
          /* @vite-ignore */
          'https://cdn.jsdelivr.net/npm/@bhsd/codemirror-mediawiki/dist/mw.min.js'
        );
        const { CodeMirror } = pkg;
        CodeMirror.fromTextArea(
          modal.get$content().querySelector('textarea[name="text"]'),
          contentmodel,
          ns,
          title,
          preferWikiEditor
        );
      }
    );
  }
});

export { index as default };
