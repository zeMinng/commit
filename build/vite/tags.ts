import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * @description VitePress 自动化标签页生成插件。
 * * 该插件会执行以下操作：
 * 1. 递归扫描 `posts(文章)` 目录下的所有 Markdown 文件。
 * 2. 解析每个文件的 Frontmatter，提取 `tag` 或 `tags` 字段。
 * 3. 在 `tags` 目录下为每个唯一标签自动创建一个目录和 `index.md`。
 * 4. 在生成的 `index.md` 中自动注入 `<TagList tag="..." />` 组件。
 * * @returns {import('vite').Plugin} 返回一个标准的 Vite 插件对象，用于 VitePress 配置文件。
 * @author zeMinng
 */

export function vitepressGenerateTagPagesPlugin(): any {
  let rootDir = process.cwd()

  async function generateTagPages() {
    const postsDir = path.join(rootDir, 'posts')
    const tagsDir = path.join(rootDir, 'tags')

    const postFiles = await listMarkdownFiles(postsDir)
    const tags = new Set<string>()

    for (const file of postFiles) {
      if (file.replace(/\\/g, '/').endsWith('/posts/index.md')) continue
      const content = await fs.readFile(file, 'utf-8')
      for (const tag of parseTagsFromMarkdown(content)) {
        if (tag) tags.add(tag)
      }
    }

    await fs.mkdir(tagsDir, { recursive: true })

    for (const tag of Array.from(tags).sort((a, b) => a.localeCompare(b))) {
      const encoded = encodeURIComponent(tag)
      const outDir = path.join(tagsDir, encoded)
      await fs.mkdir(outDir, { recursive: true })

      const mdPath = path.join(outDir, 'index.md')
      const safe = String(tag).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      const md = [
        '---',
        `title: ${tag}`,
        'layout: page',
        '---',
        '',
        `<TagList tag="${safe}" />`,
        ''
      ].join('\n')

      await fs.writeFile(mdPath, md, 'utf-8')
    }
  }

  return {
    name: 'vitepress-generate-tag-pages',
    enforce: 'pre',
    configResolved(config: any) {
      rootDir = config.root || process.cwd()
    },
    async buildStart() {
      await generateTagPages()
    },
    async handleHotUpdate(ctx: any) {
      const f = (ctx.file || '').replace(/\\/g, '/')
      if (f.includes('/posts/') && f.endsWith('.md')) {
        await generateTagPages()
      }
    }
  }
}

async function listMarkdownFiles(dir: string): Promise<string[]> {
  const out: string[] = []
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const ent of entries) {
      const full = path.join(dir, ent.name)
      if (ent.isDirectory()) {
        out.push(...(await listMarkdownFiles(full)))
      } else if (ent.isFile() && ent.name.toLowerCase().endsWith('.md')) {
        out.push(full)
      }
    }
  } catch {
    // posts 目录不存在
  }
  return out
}

function parseTagsFromMarkdown(md: string): string[] {
  const m = md.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(\r?\n|$)/)
  if (!m) return []
  return parseTagsFromFrontmatter(m[1])
}

function parseTagsFromFrontmatter(fm: string): string[] {
  const lines = fm.split(/\r?\n/)
  const tags: string[] = []

  const pushTag = (raw: string) => {
    const t = raw.trim().replace(/^['"]|['"]$/g, '')
    if (t) tags.push(t)
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const single = line.match(/^tag\s*:\s*(.+)\s*$/)
    if (single) {
      pushTag(single[1])
      continue
    }

    const tagsLine = line.match(/^tags\s*:\s*(.*)\s*$/)
    if (!tagsLine) continue

    const rest = (tagsLine[1] || '').trim()
    if (rest.startsWith('[') && rest.endsWith(']')) {
      rest
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach(pushTag)
      continue
    }

    if (rest) {
      pushTag(rest)
      continue
    }

    for (let j = i + 1; j < lines.length; j++) {
      const item = lines[j].match(/^\s*-\s*(.+)\s*$/)
      if (!item) break
      pushTag(item[1])
      i = j
    }
  }

  return Array.from(new Set(tags))
}
