import './style.scss'

import { defineIPEPlugin } from '~~/defineIPEPlugin.js'
import type {} from '@inpageedit/core/plugins/toolbox/index'

export default defineIPEPlugin({
  name: 'plugin-sample',
  inject: ['toolbox'],
  apply: async (ctx) => {
    const { add } = await import('./add.js')

    ctx.toolbox.addButton({
      id: 'plugin-sample-button',
      tooltip: 'Plugin Sample Button',
      icon: '🐟',
      onClick: () => {
        const a = Math.random() * 100
        const b = Math.random() * 100
        alert(`hello from plugin-sample! ${a} + ${b} = ${add(a, b)}`)
      },
    })

    ctx.on('dispose', () => {
      ctx.toolbox.removeButton('plugin-sample-button')
    })
  },
})
