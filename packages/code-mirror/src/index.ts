import { defineIPEPlugin } from '~~/defineIPEPlugin.js'
import type { ForkScope } from '@cordisjs/core'

declare module '@inpageedit/core' {
  export interface InPageEdit {
    'plugin:code-mirror-v6': ForkScope
  }
}

export default defineIPEPlugin({
  name: 'code-mirror-v6',
  apply: (ctx) => {
    ctx.set('plugin:code-mirror-v6', ctx.scope)

    const preferWikiEditor: string[] = []
    ctx.inject(['plugin:wiki-editor'], (ctx) => {
      preferWikiEditor.push('wikiEditor')
      ctx.get('plugin:wiki-editor')?.dispose()
    })

    const CodeMirrorPromise =
      typeof CodeMirror6 === 'function'
        ? Promise.resolve(CodeMirror6)
        : (async () => {
          const pkg = await import(
            // @ts-ignore
            /* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@bhsd/codemirror-mediawiki/dist/mw.min.js'
          )
          return pkg.CodeMirror
        })()

    ctx.on(
      'quick-edit/wiki-page',
      async ({ modal, wikiPage: { contentmodel, ns, title } }) => {
        const CodeMirror = await CodeMirrorPromise
        CodeMirror.fromTextArea(
          modal
            .get$content()
            .querySelector<HTMLTextAreaElement>('textarea[name="text"]')!,
          contentmodel,
          ns,
          title,
          preferWikiEditor
        )
      }
    )
  },
})
