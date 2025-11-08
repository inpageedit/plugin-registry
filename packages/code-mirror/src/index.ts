import { defineIPEPlugin } from '~~/defineIPEPlugin.js'

declare module '@inpageedit/core' {
  export interface InPageEdit {
    'plugin:code-mirror-v6': boolean
  }
}

export default defineIPEPlugin({
  name: 'code-mirror-v6',
  apply: (ctx) => {
    ctx.set('plugin:code-mirror-v6', true)

    let preferWikiEditor = false
    ctx.inject(['plugin:wiki-editor'], () => {
      preferWikiEditor = true
      for (let [_, scope] of ctx.registry.entries()) {
        if (scope.name === 'wiki-editor') {
          scope.dispose()
          break
        }
      }
    })

    ctx.on(
      'quick-edit/wiki-page',
      async ({ modal, wikiPage: { contentmodel, ns, title } }) => {
        const pkg = await import(
          // @ts-ignore
          /* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@bhsd/codemirror-mediawiki/dist/mw.min.js'
        )
        const { CodeMirror } = pkg
        const cm = CodeMirror.fromTextArea(
          modal.get$content().querySelector('textarea[name="text"]')!,
          contentmodel,
          ns,
          title
        )
        cm.prefer({ wikiEditor: preferWikiEditor })
      }
    )
  },
})
