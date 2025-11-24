import './style.scss'
import { defineIPEPlugin } from '~~/defineIPEPlugin.js'
import type { IWikiTitle } from '@inpageedit/core'

// JSX Components
const EditButton = ({
  isRedLink,
  onClick,
}: {
  isRedLink: boolean
  onClick: (e: MouseEvent) => void
}) =>
  (
    <a
      href="#ipe://quick-edit/"
      class={`ipe-quick-edit ${isRedLink ? 'ipe-quick-edit--create-only' : ''}`}
      style="user-select: none; margin-left: 0.2em;"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-pencil-bolt ipe-icon"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
        <path d="M13.5 6.5l4 4" />
        <path d="M19 16l-2 3h4l-2 3" />
      </svg>
    </a>
  ) as HTMLAnchorElement

const CounterpartLinks = ({
  counterpartTitle,
  isMissing,
  onCounterpartEditClick,
}: {
  counterpartTitle: IWikiTitle
  isMissing: boolean
  onCounterpartEditClick: (e: MouseEvent) => void
}) => {
  const isCounterpartSubject = counterpartTitle.equals(counterpartTitle.getSubjectPage())
  const counterpartText = isCounterpartSubject ? 'Main' : 'Talk'
  const counterpartPrefixed = counterpartTitle.getPrefixedText()

  let href = counterpartTitle.getURL().toString()
  if (isMissing) {
    const url = new URL(href, window.location.origin)
    url.searchParams.set('action', 'edit')
    url.searchParams.set('redlink', '1')
    href = url.pathname + url.search
  }

  return (
    <span class="ipe-in-cat-edit-counterpart">
      {' ('}
      <a href={href} title={counterpartPrefixed} class={isMissing ? 'new' : ''}>
        {counterpartText}
      </a>
      <EditButton isRedLink={isMissing} onClick={onCounterpartEditClick} />
      {')'}
    </span>
  ) as HTMLSpanElement
}

type AnchorModel = {
  $el: HTMLAnchorElement
  titlePrefixed: string
  counterpart?: {
    title: IWikiTitle
    prefixed: string
  }
}

export default defineIPEPlugin({
  name: 'in-cat-edit',
  inject: ['quickEdit', 'inArticleLinks', 'api', 'wiki'],
  apply: (ctx) => {
    // Only run in Category namespace
    const ns = ctx.wiki.mwConfig.get('wgNamespaceNumber')
    if (ns !== 14) return

    mw.hook('wikipage.content').add(async ($content: any) => {
      const content = $content[0]
      if (!content) return

      const categoryContent = content.querySelector('.mw-category, #mw-pages')
      if (!categoryContent) return

      const anchors = ctx.inArticleLinks.scanAnchors(categoryContent as HTMLElement)

      const models: AnchorModel[] = []
      const titlesToCheck: string[] = []

      // Build models
      for (const { $el, title } of anchors) {
        if (!title) continue

        const titlePrefixed = title.getPrefixedText()
        const counterpartTitle = getCounterpartTitle(title)

        const model: AnchorModel = { $el, titlePrefixed }

        if (counterpartTitle) {
          const counterpartPrefixed = counterpartTitle.getPrefixedText()
          model.counterpart = {
            title: counterpartTitle,
            prefixed: counterpartPrefixed,
          }
          titlesToCheck.push(counterpartPrefixed)
        }

        models.push(model)
      }

      const missingTitles = await getMissingTitles(titlesToCheck, ctx.api)

      // Render
      for (const { $el, titlePrefixed, counterpart } of models) {
        if ($el.dataset.ipeInCatEditProcessed) continue
        $el.dataset.ipeInCatEditProcessed = '1'

        const fragment = document.createDocumentFragment()

        // 1. Edit button for current page
        fragment.appendChild(
          <EditButton
            isRedLink={false}
            onClick={(e) => {
              e.preventDefault()
              ctx.quickEdit.showModal({
                title: titlePrefixed,
                createOnly: false,
              })
            }}
          />
        )

        // 2. Counterpart link and its edit button
        if (counterpart) {
          const { title: counterpartTitle, prefixed: counterpartPrefixed } = counterpart
          const isMissing = missingTitles.has(counterpartPrefixed)

          fragment.appendChild(
            <CounterpartLinks
              counterpartTitle={counterpartTitle}
              isMissing={isMissing}
              onCounterpartEditClick={(e) => {
                e.preventDefault()
                ctx.quickEdit.showModal({
                  title: counterpartPrefixed,
                  createOnly: isMissing,
                })
              }}
            />
          )
        }

        const parent = $el.parentNode
        if (parent) {
          parent.insertBefore(fragment, $el.nextSibling)
        }
      }
    })
  },
})

const getCounterpartTitle = (title: IWikiTitle): IWikiTitle | null => {
  const subject = title.getSubjectPage()
  if (title.equals(subject)) {
    return title.getTalkPage()
  }
  return subject
}

const getMissingTitles = async (
  titles: string[],
  api: any,
  chunkSize = 50
): Promise<Set<string>> => {
  const missing = new Set<string>()
  const requests: Promise<void>[] = []

  for (let i = 0; i < titles.length; i += chunkSize) {
    const chunk = titles.slice(i, i + chunkSize)

    requests.push(
      api
        .post({
          action: 'query',
          titles: chunk.join('|'),
          format: 'json',
          formatversion: 2,
        })
        .then((response: any) => {
          const query = response.data?.query || response.query
          query?.pages?.forEach((page: any) => {
            if (page.missing) {
              missing.add(page.title)
            }
          })
        })
        .catch((e: unknown) => {
          console.error('[in-cat-edit] Failed to check page existence', e)
        })
    )
  }

  await Promise.all(requests)
  return missing
}
