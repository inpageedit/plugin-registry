import { defineIPEPlugin } from '~~/defineIPEPlugin.js'
import type { ForkScope } from '@cordisjs/core'

declare global {
  interface Window {
    mw: {
      addWikiEditor: (textarea: JQuery<HTMLTextAreaElement>) => void
    }
  }
}

declare module '@inpageedit/core' {
  export interface InPageEdit {
    'plugin:wiki-editor': ForkScope
  }
}

export default defineIPEPlugin({
  name: 'wiki-editor',
  apply(ctx) {
    ctx.set('plugin:wiki-editor', ctx.scope)

    let pluginCodeMirror: ForkScope | undefined
    ctx.inject(['plugin:code-mirror-v6'], (ctx) => {
      pluginCodeMirror = ctx.get('plugin:code-mirror-v6')
    })

    ctx.on('quick-edit/wiki-page', (payload) => {
      if (pluginCodeMirror?.isActive) {
        return
      }
      const textarea = payload.modal
        .get$content()
        .querySelector<HTMLTextAreaElement>('textarea[name="text"]')!
      const registered = !!mw.loader.getState('ext.wikiEditor')
      if (!textarea || !registered) {
        return
      }
      if (typeof window.mw?.addWikiEditor === 'function') {
        window.mw.addWikiEditor($(textarea))
      } else {
        mw.loader.load(['ext.wikiEditor'])
      }
    })
  },
})
