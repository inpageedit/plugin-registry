import './style.scss'

import { defineIPEPlugin } from '~~/defineIPEPlugin.js'

export default defineIPEPlugin({
  name: 'in-cat-edit',
  inject: ['quickEdit', 'inArticleLinks', 'api', 'wiki'],
  apply: (ctx) => {
    // Only run in Category namespace
    const ns = ctx.wiki.mwConfig.get('wgNamespaceNumber')
    if (ns !== 14) {
      return
    }

    // Helper to create edit button
    const createEditBtn = (title: string, isRedLink: boolean = false) => {
      const $btn = $('<a>')
        .attr('href', '#ipe://quick-edit/') // Keep consistent with quick-edit
        .addClass('ipe-quick-edit')
        .addClass(isRedLink ? 'ipe-quick-edit--create-only' : '')
        .css({
          userSelect: 'none',
          marginLeft: '0.2em',
        })
        .html(
          `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil-bolt ipe-icon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /><path d="M19 16l-2 3h4l-2 3" /></svg>`
        )
        .on('click', (e) => {
          e.preventDefault()
          ctx.quickEdit.showModal({ title, createOnly: isRedLink })
        })
      return $btn
    }

    mw.hook('wikipage.content').add(async ($content) => {
      const $categoryContent = $content.find('.mw-category, #mw-pages')
      if (!$categoryContent.length) return

      const anchors = ctx.inArticleLinks.scanAnchors($categoryContent[0])
      const formattedNamespaces = ctx.wiki.mwConfig.get('wgFormattedNamespaces')

      // Build models
      const models: AnchorModel[] = []
      const titlesToCheck: string[] = []

      anchors.forEach(({ $el, title }) => {
        if (!title) return

        const mwTitle = new mw.Title(title.getPrefixedDBKey())
        const counterpartTitle = getCounterpartTitle(mwTitle, formattedNamespaces)

        models.push({ $el, mwTitle, counterpartTitle })

        if (counterpartTitle) {
          titlesToCheck.push(counterpartTitle.getPrefixedText())
        }
      })

      // Fetch missing titles
      const missingTitles =
        titlesToCheck.length > 0 ? await getMissingTitles(titlesToCheck, ctx.api) : new Set<string>()

      // Render
      models.forEach(({ $el, mwTitle, counterpartTitle }) => {
        if ($el.dataset.ipeInCatEditProcessed) return
        $el.dataset.ipeInCatEditProcessed = '1'

        const $link = $($el)
        const prefixed = mwTitle.getPrefixedText()

        // 1. Edit button for current page
        const $currentEditBtn = createEditBtn(prefixed)

        // 2. Counterpart link and its edit button
        const $counterpartWrapper = $('<span>').addClass('ipe-in-cat-edit-counterpart')

        if (counterpartTitle) {
          const isTalk = mw.Title.isTalkNamespace(mwTitle.getNamespaceId())
          const counterpartText = isTalk ? 'Main' : 'Talk'
          const counterpartPrefixed = counterpartTitle.getPrefixedText()
          const isMissing = missingTitles.has(counterpartPrefixed)

          const $counterpartLink = $('<a>')
            .attr('href', counterpartTitle.getUrl())
            .attr('title', counterpartPrefixed)
            .text(counterpartText)

          if (isMissing) {
            $counterpartLink.addClass('new')
            // Add redlink=1 to href if missing
            const url = new URL($counterpartLink.attr('href')!, window.location.origin)
            url.searchParams.set('action', 'edit')
            url.searchParams.set('redlink', '1')
            $counterpartLink.attr('href', url.pathname + url.search)
          }

          const $counterpartEditBtn = createEditBtn(counterpartPrefixed, isMissing)

          $counterpartWrapper
            .append(' (')
            .append($counterpartLink)
            .append($counterpartEditBtn)
            .append(')')
        }

        $link.after($counterpartWrapper).after($currentEditBtn)
      })
    })
  },
})

type AnchorModel = {
  $el: HTMLAnchorElement
  mwTitle: mw.Title
  counterpartTitle: mw.Title | null
}

const getCounterpartTitle = (
  mwTitle: mw.Title,
  formattedNamespaces: Record<number, string>
): mw.Title | null => {
  const namespaceId = mwTitle.getNamespaceId()
  // Should not happen for category members usually, but good to check
  if (namespaceId < 0) return null

  const isTalk = mw.Title.isTalkNamespace(namespaceId)
  const counterpartNs = isTalk ? namespaceId - 1 : namespaceId + 1

  // Check if counterpart namespace exists
  if (formattedNamespaces[counterpartNs] === undefined) return null

  return mw.Title.makeTitle(counterpartNs, mwTitle.getMainText())
}

const getMissingTitles = async (
  titles: string[],
  api: typeof window.ipe.api,
  chunkSize = 50
): Promise<Set<string>> => {
  const missing = new Set<string>()

  for (let i = 0; i < titles.length; i += chunkSize) {
    const chunk = titles.slice(i, i + chunkSize)
    try {
      const response = await api.post({
        action: 'query',
        titles: chunk.join('|'),
        format: 'json',
        formatversion: 2,
      }) as any

      const query = response.data?.query || response.query

      query?.pages?.forEach((page: any) => {
        if (page.missing) {
          missing.add(page.title)
        }
      })
    } catch (e) {
      console.error('[in-cat-edit] Failed to check page existence', e)
    }
  }

  return missing
}
