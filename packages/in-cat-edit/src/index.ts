import './style.scss'

import { defineIPEPlugin } from '~~/defineIPEPlugin.js'

export default defineIPEPlugin({
  name: 'in-cat-edit',
  inject: ['quickEdit', 'inArticleLinks', 'api', 'wiki'],
  apply: async (ctx) => {
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

    mw.hook('wikipage.content').add(($content) => {
      (async () => {
        const $categoryContent = $content.find('.mw-category, #mw-pages')
        if (!$categoryContent.length) return

        const anchors = ctx.inArticleLinks.scanAnchors($categoryContent[0])

        const counterpartMap = new Map<string, mw.Title>()
        const titlesToCheck: string[] = []
        const formattedNamespaces = ctx.wiki.mwConfig.get('wgFormattedNamespaces')

        anchors.forEach(({ title }) => {
          if (!title) return
          // Convert to mw.Title to ensure we have all methods
          const mwTitle = new mw.Title(title.getPrefixedDBKey())
          const namespaceId = mwTitle.getNamespaceId()
          let counterpartTitle: mw.Title | null = null

          if (namespaceId >= 0) {
            const isTalk = mw.Title.isTalkNamespace(namespaceId)
            const counterpartNs = isTalk ? namespaceId - 1 : namespaceId + 1

            // Check if counterpart namespace exists
            if (formattedNamespaces[counterpartNs] !== undefined) {
              counterpartTitle = mw.Title.makeTitle(counterpartNs, mwTitle.getMainText())
            }
          }

          if (counterpartTitle) {
            const prefixedText = counterpartTitle.getPrefixedText()
            counterpartMap.set(mwTitle.getPrefixedText(), counterpartTitle)
            titlesToCheck.push(prefixedText)
          }
        })

        // Batch check existence
        const missingTitles = new Set<string>()

        if (titlesToCheck.length > 0) {
          // Split into chunks of 50 to avoid API limits
          const chunkSize = 50
          for (let i = 0; i < titlesToCheck.length; i += chunkSize) {
            const chunk = titlesToCheck.slice(i, i + chunkSize)
            try {
              const response = await ctx.api.post({
                action: 'query',
                titles: chunk,
                format: 'json',
                formatversion: 2,
              }) as any
              const query = response.data?.query

              query?.pages?.forEach((page: any) => {
                if (page.missing) {
                  missingTitles.add(page.title)
                }
              })
            } catch (e) {
              console.error('[in-cat-edit] Failed to check page existence', e)
            }
          }
        }

        // Render
        anchors.forEach(({ $el, title }) => {
          if (!title || $el.dataset.ipeInCatEditProcessed) return
          $el.dataset.ipeInCatEditProcessed = '1'

          const mwTitle = new mw.Title(title.getPrefixedDBKey())
          const $link = $($el)

          // 1. Edit button for current page
          const $currentEditBtn = createEditBtn(mwTitle.getPrefixedText())

          // 2. Counterpart link and its edit button
          const counterpartTitle = counterpartMap.get(mwTitle.getPrefixedText())
          const $counterpartWrapper = $('<span>').addClass('ipe-in-cat-edit-counterpart')

          if (counterpartTitle) {
            const counterpartText = mw.Title.isTalkNamespace(mwTitle.getNamespaceId()) ? 'Main' : 'Talk'
            const isMissing = missingTitles.has(counterpartTitle.getPrefixedText())

            const $counterpartLink = $('<a>')
              .attr('href', counterpartTitle.getUrl())
              .attr('title', counterpartTitle.getPrefixedText())
              .text(counterpartText)

            if (isMissing) {
              $counterpartLink.addClass('new')
              // Add redlink=1 to href if missing
              const url = new URL($counterpartLink.attr('href')!, window.location.origin)
              url.searchParams.set('action', 'edit')
              url.searchParams.set('redlink', '1')
              $counterpartLink.attr('href', url.pathname + url.search)
            }

            const $counterpartEditBtn = createEditBtn(counterpartTitle.getPrefixedText(), isMissing)

            $counterpartWrapper
              .append(' (')
              .append($counterpartLink)
              .append($counterpartEditBtn)
              .append(')')
          }

          $link.after($counterpartWrapper).after($currentEditBtn)
        })
      })()
    })
  },
})
