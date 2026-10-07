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
  name: "wiki-editor",
  apply(ctx) {
    ctx.set("plugin:wiki-editor", ctx.scope);
    let pluginCodeMirror;
    ctx.inject(["plugin:code-mirror-v6"], (ctx2) => {
      pluginCodeMirror = ctx2.get("plugin:code-mirror-v6");
    });
    ctx.on("quick-edit/wiki-page", async (payload) => {
      if (pluginCodeMirror?.isActive) {
        return;
      }
      const textarea = payload.modal.get$content().querySelector('textarea[name="text"]');
      const registered = !!mw.loader.getState("ext.wikiEditor");
      if (!textarea || !registered) {
        return;
      }
      await mw.loader.using(["ext.wikiEditor"]);
      if (typeof window.mw?.addWikiEditor === "function") {
        window.mw.addWikiEditor($(textarea));
      }
    });
  }
});

export { index as default };
