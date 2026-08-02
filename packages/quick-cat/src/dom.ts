// DOM helpers: static SVG icons (elements are created via JSX / jsx-dom)

const TAG_ICON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="icon icon-tabler icons-tabler-outline icon-tabler-tag">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3" />
  </svg>
`

const INFO_ICON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M12 9h.01" />
    <path d="M11 12h1v4h1" />
  </svg>
`

// Parse via DOMParser (not innerHTML) to build the SVG element from a static constant
function createSvgIcon(svg: string): HTMLElement {
  const doc = new DOMParser().parseFromString(svg.trim(), 'image/svg+xml')
  return doc.documentElement as unknown as HTMLElement
}

export const createTagIcon = () => createSvgIcon(TAG_ICON_SVG)
export const createInfoIcon = () => createSvgIcon(INFO_ICON_SVG)
