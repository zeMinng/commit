import { defineAsyncComponent, type Component } from 'vue'
import type { Theme, EnhanceAppContext } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './styles/index.scss'
import Layout from './layouts/MyLayout.vue'
import PostList from './components/PostList/PostList.vue'
import TagList from './components/TagList/TagList.vue'

const GLOBAL_COMPONENTS: [string, Component][] = [
  ['PostList', PostList],
  ['TagList', TagList],
  ['ArchiveList', defineAsyncComponent(() => import('./components/ArchiveList/ArchiveList.vue'))],
  ['ResourceList', defineAsyncComponent(() => import('./components/ResourceList/ResourceList.vue'))],
]

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp?.(ctx)

    GLOBAL_COMPONENTS.forEach(([name, comp]) => {
      ctx.app.component(name, comp)
    })
  },
} satisfies Theme
