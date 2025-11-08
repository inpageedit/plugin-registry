import { defineIPEPlugin } from '~~/defineIPEPlugin.js'

export default defineIPEPlugin({
  name: 'code-mirror-v6',
  apply: (ctx) => {
    ctx.set('plugin:code-mirror-v6', true)
    ctx.on(
      'quick-edit/wiki-page',
      async ({ modal, wikiPage: { contentmodel, ns, title } }) => {
        ;const cm = await (
          await import(
            // @ts-ignore
            /* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@bhsd/codemirror-mediawiki/dist/mw.min.js'
          )
        ).CodeMirror.fromTextArea(
          modal.get$content().querySelector('textarea[name="text"]')!,
          contentmodel,
          ns,
          title
        )
        if (ctx.get('plugin:wiki-editor')) {
          cm.prefer({wikiEditor: true})
        }
      }
    )
  },
})
