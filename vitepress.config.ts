import type { VitePressConfigType } from '~/types/configType'

const AUTHOR_NAME = 'zeMinng'

export const VitePressConfig: VitePressConfigType = {
  author: AUTHOR_NAME,
  ogImage: 'logo.png',
  siteConfig: {
    title: 'zeMinng',
    description: 'commit - 小棱镜记录文档.',
    lang: 'zh-CN',
    cleanUrls: true,
    lastUpdated: true,
  },
  themeConfig: {
    siteTitle: 'zeMinng',
    logo: '/logo.png',
    outline: [2, 4],
    nav: [
      { text: '文章', link: '/postsPage' },
      { text: '标签', link: '/tagsPage' },
      { text: '归档', link: '/archivesPage' },
      { text: '资源', link: '/resourcesPage' },
      { text: '作品', link: '/works/' },
      { text: '关于', link: '/about' },
    ],
    socialLinks: [
      { icon: 'github', link: `https://github.com/${AUTHOR_NAME}` },
      { icon: 'x', link: 'https://twitter.com/xiaoxiaoemil' }
    ],
    footer: {
      message: 'CC BY-NC-SA 4.0 协议',
      copyright: `版权所有 © 2023-${new Date().getFullYear()} ${AUTHOR_NAME} | 保留所有权利` 
    },
  },
  homeConfig: {
    heroName: '小棱镜',
    // tagline: AUTHOR_NAME,
    description: '探索细节，激发创意',
    avatar: '/logo.png',
    actions: [
      { theme: 'brand', text: '开始阅读', link: '/postsPage' },
      { theme: 'alt', text: '关于作者', link: '/about' },
    ],
    features: [
      { icon: '⚡️', title: '帮助', details: '快速查找技巧，减少学习曲线，提升工作效率', },
      { icon: '🖖', title: '专注', details: '清晰目标，减少干扰，提高效率，提升质量', },
      { icon: '🛠️', title: '编码', details: '提供代码示例，快速解决问题，提升开发效率', }
    ],
    socials: [
      { label: 'GitHub', url: 'https://github.com/zeMinng' },
      { label: 'X / Twitter', url: 'https://twitter.com/xiaoxiaoemil' },
    ],
  },
  watermarkConfig: {
    enable: true,
    text: 'zeMinng',
    darkColor: 'rgba(0,0,0,.7)',
    lightColor: 'rgba(0,0,0,.15)',
    fontSize: 16,
  },
} as const
