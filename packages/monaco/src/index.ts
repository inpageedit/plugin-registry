import { BasePlugin } from '~~/defineIPEPlugin.js'
import type { Events, InPageEdit } from '@inpageedit/core'
import type {} from '@inpageedit/core/services/WikiTitleService'
import type {} from '@inpageedit/core/plugins/toolbox/index'
import type {} from '@inpageedit/core/plugins/quick-edit/index'
import { IWikiPage } from '@inpageedit/core/dist/models/WikiPage/index.js'

export class PluginMonaco extends BasePlugin {
  constructor(ctx: InPageEdit) {
    super(ctx, {}, 'monaco-editor')
    ctx.set('plugin:monaco-editor', true)
  }

  protected async start() {
    this.ctx.on('quick-edit/wiki-page', this.onQuickEditWikiPage.bind(this))
  }

  async onQuickEditWikiPage(
    payload: Parameters<Events['quick-edit/wiki-page']>[0]
  ) {
    const { init } = await import('modern-monaco')

    const { modal, wikiPage } = payload
    const textarea = modal
      .get$content()
      .querySelector<HTMLTextAreaElement>('textarea[name="text"]')
    const wrapper = modal
      .get$content()
      .querySelector<HTMLDivElement>('.ipe-quickEdit__content')
    if (!textarea || !wrapper) return

    const language =
      wikiPage.contentmodel ||
      this.guessLangByTitle(wikiPage.title) ||
      'wikitext'
    const monaco = await init({})
    const container = document.createElement('div')
    container.style.width = wrapper.clientWidth + 'px'
    container.style.height = '65lvh'
    wrapper.appendChild(container)
    const editor = monaco.editor.create(container, {
      theme: 'vs-dark',
      automaticLayout: true,
      language,
      tabSize: 2,
      glyphMargin: true,
      wordWrap: language === 'wikitext' ? 'on' : 'off',
      wordBreak: language === 'wikitext' ? 'keepAll' : 'normal',
      unicodeHighlight:
        language === 'wikitext'
          ? {
              ambiguousCharacters: false,
            }
          : undefined,
    })
    const model = this.createModel(monaco, wikiPage)
    editor.setModel(model)
    model.onDidChangeAttached(() => {
      textarea.value = model.getValue()
      textarea.dispatchEvent(new Event('input'))
      textarea.dispatchEvent(new Event('change'))
    })
  }

  guessLangByTitle(input = '') {
    const title = this.ctx.wikiTitle.newTitle(input)
    const nsNumber = title.getNamespaceId()
    const pageName = title.getMainText()
    const ext = pageName.split('.').pop()
    if (ext === 'js') {
      return 'javascript'
    } else if (ext === 'css') {
      return 'css'
    }
    // NS_MODULE
    else if (nsNumber === 828 && !pageName.endsWith('/doc')) {
      return 'lua'
    }
    // NS_WIDGET
    else if (nsNumber === 274) {
      return 'html'
    } else if (ext === 'json') {
      return 'json'
    }
    return 'wikitext'
  }

  async createWorkspace(wikiPage: IWikiPage) {
    const { Workspace } = await import('modern-monaco')
    const workspace = new Workspace({
      name: wikiPage.title,
      initialFiles: {
        [wikiPage.title]: wikiPage.revisions?.[0]?.content || '',
      },
      entryFile: wikiPage.title,
    })
    workspace.openTextDocument(wikiPage.title)
    return workspace
  }

  createModel(
    monaco: Awaited<ReturnType<typeof import('modern-monaco').init>>,
    wikiPage: IWikiPage
  ) {
    return monaco.editor.createModel(
      wikiPage.revisions?.[0]?.content || '',
      wikiPage.contentmodel ||
        this.guessLangByTitle(wikiPage.title) ||
        'wikitext'
    )
  }
}
