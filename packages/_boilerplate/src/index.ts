import { defineIPEPlugin } from '~~/defineIPEPlugin.js'
import type {} from '@inpageedit/core/plugins/toolbox/index'

export default defineIPEPlugin({
  name: 'plugin-sample',
  inject: ['toolbox'],
  apply: (ctx) => {
    ctx.toolbox.addButton({
      id: 'plugin-sample-button',
      tooltip: 'Plugin Sample Button',
      icon: '🐟',
      onClick: () => {
        alert('hello from plugin-sample')
      },
    })

    ctx.on('dispose', () => {
      ctx.toolbox.removeButton('plugin-sample-button')
    })
  },
})
