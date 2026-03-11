import { DefaultTheme } from 'vitepress'

/**
 * @description VitePress 配置
 */
export interface VitePressConfigType {
  author: string // 作者
  ogImage: string // logo
  siteConfig: SiteConfig // 站点配置
  themeConfig: DefaultTheme.Config & themeConfig // 主题配置
  homeConfig: HomeConfig // 首页配置
  watermarkConfig: WatermarkConfig // 水印配置
}

// 站点配置
interface SiteConfig {
  title: string // 站点元数据
  description: string // 站点的描述。这将呈现为页面 HTML 中的 <meta> 标签
  lang: string // 站点的 lang 属性
  cleanUrls: boolean // 干净的 URL
  lastUpdated: boolean // 使用 Git 获取每个页面的最后更新时间戳，可通过 useData 访问
}

// 主题扩展配置（在 DefaultTheme.Config 基础上补充博客特有字段）
interface themeConfig {}

// 首页配置（博客主页）- 用于动态生成默认 VitePress 首页
interface HomeConfig {
  heroName: string // 首页主标题，一般是作者名或博客名
  tagline?: string // 一句个性签名 / 标语（作为 hero.text）
  description?: string // 较长的个人简介，用于介绍作者和博客内容定位（作为 hero.tagline）
  avatar: string // 头像图片路径
  actions?: {
    theme?: 'brand' | 'alt'
    text: string
    link: string
  }[] // Hero 区域按钮，不配置则使用默认
  features?: {
    icon: string
    title: string
    details: string
    link?: string
    linkText?: string
  }[] // Feature 卡片，不配置则使用默认
  socials?: {
    label: string
    url: string
  }[] //社交链接（保留，可用于自定义组件）
}

// 水印配置
interface WatermarkConfig {
  enable: boolean // 是否启用水印
  text: string // 水印文本
  lightColor: string // 水印颜色
  darkColor: string // 水印颜色
  fontSize: number // 水印字体大小
}
