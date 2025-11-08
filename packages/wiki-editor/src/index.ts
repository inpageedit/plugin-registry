import { defineIPEPlugin } from '~~/defineIPEPlugin.js'
import type {} from '@inpageedit/core/plugins/toolbox/index'

declare global {
  interface Window {
    mw: {
      addWikiEditor: (textarea: JQuery<HTMLTextAreaElement>) => void
    }
  }
}

export default defineIPEPlugin({
  name: 'wiki-editor',
  apply(ctx) {
    ctx.set('plugin:wiki-editor', true)
    ctx.on('quick-edit/wiki-page', async (payload) => {
      if (ctx.get('plugin:code-mirror-v6')) {
        return
      }
      const textarea = payload.modal
        .get$content()
        .querySelector<HTMLTextAreaElement>('textarea[name="text"]')!
      const registered = !!mw.loader.getState('ext.wikiEditor')
      if (!textarea || !registered) {
        return
      }
      await mw.loader.using(['ext.wikiEditor'])
      if (typeof window.mw?.addWikiEditor === 'function') {
        window.mw.addWikiEditor($(textarea))
      }
    })
  },
})
