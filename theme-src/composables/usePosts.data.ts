import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/**/*.md', {
  excerpt: true, // 如果你想在列表显示摘要
  transform(raw): PostData[] {
    return raw
      .filter(({ url }) => {
        // 排除列表页自身：/posts/ 或 /posts（对应 posts/index.md）
        const u = url.replace(/\/$/, '')
        return u !== '/posts'
      })
      .map(({ url, frontmatter }) => {
        const tags = frontmatter.tags != null
          ? (Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags])
          : (frontmatter.tag != null ? [frontmatter.tag] : [])
        return {
          title: frontmatter.title || '无题',
          url,
          date: formatDate(frontmatter.date),
          excerpt: frontmatter.description,
          tags: tags.filter(Boolean).map(String)
        }
      })
      .sort((a, b) => b.date.time - a.date.time) // 按时间倒序排序
  }
})

function formatDate(raw: string | number | Date) {
  const date = new Date(raw)
  return {
    time: +date,
    string: date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }
}

interface PostData {
  title: string
  url: string
  date: { time: number; string: string }
  excerpt: string
  tags: string[]
}