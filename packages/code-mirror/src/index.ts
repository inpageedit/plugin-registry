import { defineIPEPlugin } from '~~/defineIPEPlugin.js'

export default defineIPEPlugin({
  name: 'code-mirror-v6',
  apply: (ctx) => {
    ctx.on(
      'quick-edit/wiki-page',
      async ({ modal, wikiPage: { contentmodel, ns, title } }) => {
        ;(
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
      }
    )
  },
})
