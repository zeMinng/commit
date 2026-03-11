import { createContentLoader } from 'vitepress'

/** 单条资源（用于 resources 数组或旧版单条 frontmatter） */
interface ResourceEntry {
  title?: string
  description?: string
  link?: string
  download?: string
}

export default createContentLoader('resources/**/*.md', {
  transform(raw): ResourceItem[] {
    const list: ResourceItem[] = []
    for (const { url, frontmatter } of raw) {
      const u = url.replace(/\/$/, '')
      if (u === '/resources') continue

      const category = (frontmatter.category as string) || '其他'

      /**
       * 情况一：同分类多资源写在一个 md 里，frontmatter.resources 为数组
       */
      const resources = frontmatter.resources as ResourceEntry[] | undefined
      if (Array.isArray(resources) && resources.length > 0) {
        resources.forEach((r, i) => {
          list.push({
            title: r.title || '未命名资源',
            description: r.description || '',
            link: r.link || '',
            download: r.download || '',
            category,
            url: `${url}#${i}-${(r.title || '').replace(/\s+/g, '-')}`
          })
        })
        continue
      }

      /**
       * 情况二：一个 md 一条资源，frontmatter 直接是 title/description/link/download/category
       */
      list.push({
        title: (frontmatter.title as string) || '未命名资源',
        description: (frontmatter.description as string) || '',
        link: (frontmatter.link as string) || '',
        download: (frontmatter.download as string) || '',
        category,
        url
      })
    }
    return list.sort(
      (a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title)
    )
  }
})

export interface ResourceItem {
  title: string
  description: string
  link: string
  download: string
  category: string
  url: string
}
